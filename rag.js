const { PineconeStore } = require("@langchain/pinecone");
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { Pinecone } =require('@pinecone-database/pinecone') ;
const {pull} = require("langchain/hub");
const { RunnableSequence, RunnablePassthrough } = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");   
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");    
const {ChatPromptTemplate, PromptTemplate, MessagesPlaceholder} = require("@langchain/core/prompts") ;   
const { loadQAMapReduceChain } =require("langchain/chains") ;
const {createHistoryAwareRetriever} = require("langchain/chains/history_aware_retriever");
const { Document } =require("@langchain/core/documents"); 
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
require('dotenv').config()

async function queryBooks(query){
    const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
    })
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    })
    const indexName = process.env.PINECONE_INDEX_NAME
    const pineconeIndex = pc.Index(indexName)
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {indexName: indexName, pineconeIndex: pineconeIndex})
    const retriever = vectorStore.asRetriever();

    
    // const relevantDocs = await retriever.invoke(query);

    const model = new ChatOpenAI({ 
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-3.5-turbo"
    });
    
    // create  history aware retriever chain
   


    // const rephrasePrompt = ChatPromptTemplate.fromText("Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question. Chat History: {chat_history} Follow Up Input: {input} Standalone Question:")
    const rephrasePrompt = await pull("langchain-ai/chat-langchain-rephrase"); // input variables : chat_history, input

    const historyAwareRetriever  = await createHistoryAwareRetriever({
        llm: model, retriever: retriever, rephrasePrompt: rephrasePrompt
    })

    // create qa chain

    const systemPrompt="You are a book expert who is giving advice to a friend. Use the following pieces of retrieved context to answer the question. If you don't know the answer, say that you don't know. Use three sentences maximum and keep the answer concise. \n\n {context}"
    const qaPrompt =ChatPromptTemplate.fromMessages(
        [
            ("system", systemPrompt),
            new MessagesPlaceholder("chat_history"),
            ("human", "{input}")
        ]
    )

    // this chain will take the question and the context and return the answer. the knowledge is based on documents(context)
    const questionAnswerChain = await createStuffDocumentsChain({
        llm: model,
        prompt: qaPrompt,
        // outputParser: new StringOutputParser(),
    });

    const ragChain = await createRetrievalChain({
        retriever: historyAwareRetriever,
        combineDocsChain: questionAnswerChain
    })
 
    
    // invoking the chain
    const chat_history = []
    // const question = query
    let results = await ragChain.invoke({
        "input": query, "chat_history": chat_history
    });

    chat_history.push(
        new HumanMessage(content=query),
        
    )
    chat_history.push(
    new AIMessage(content=results["answer"])
        
    )
    console.log(results["answer"])
    return results["answer"]

    // const mapReduceChain = loadQAMapReduceChain(model);
    // const results = await mapReduceChain.invoke({
    //     question: query,
    //     input_documents: relevantDocs,
    // });
}

// 
// console.log(queryBooks("hi"))

module.exports = {queryBooks};