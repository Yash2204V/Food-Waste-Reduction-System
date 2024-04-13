!pip install chromadb sentence_transformers pypdf langchain python-multipart nest-asyncio pyngrok uvicorn

from transformers import AutoTokenizer
import transformers
import torch 
import time
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
from langchain.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.document_loaders.csv_loader import CSVLoader
import chromadb
from langchain.llms import HuggingFacePipeline
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain.vectorstores import Chroma
import nest_asyncio
from pyngrok import ngrok
import uvicorn
from fastapi import FastAPI,File,UploadFile , HTTPException
from typing import List
import io

model = "/kaggle/input/llama-2/pytorch/7b-chat-hf/1"

tokenizer = AutoTokenizer.from_pretrained(model)
pipeline = transformers.pipeline(
    "text-generation",
    model=model,
    torch_dtype=torch.float16,
    device_map="auto",
)

from langchain.llms import HuggingFacePipeline

def ask(query):
    query=query
    prompt_Template='''name five distinct words that rhyme with the word:{query}
    Answer:'''
    prompt=PromptTemplate(
        input_variables=['query'],template=prompt_Template
    )
    llm_chain=LLMChain(llm=llm,prompt=prompt)
    answer=llm_chain.predict(query=query)
    return answer

loader = PyPDFDirectoryLoader("/kaggle/input/dataset")
data = loader.load()
print(data)

document_splitter=CharacterTextSplitter(separator="\n",chunk_size=500 , chunk_overlap=20)

embedding_function=SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

text_chunks=document_splitter.split_documents(data)
text=Chroma.from_documents(text_chunks,embedding=embedding_function, persist_directory='./book')
text_retriever=text.as_retriever(search_type="mmr")

def slice_from_word(input_string , word):
    words=input_string.split(word)
    if len(words)>1:
        return word+words[1]
    else:
        return ""

def ask(queryTemplate):
    query=queryTemplate
    prompt_template='''Give response to:{query}
    Bot name is FoodSavr and its creator team is Debug Thugs
    Answer:'''
    prompt=PromptTemplate(
    input_variables=['query'],template=prompt_template
    )
    llm_chain=LLMChain(llm=llm,prompt=prompt)
    answer=llm_chain.predict(query=query)
    return slice_from_word(answer,'Answer:')

print(ask("Ask your questions here"))
