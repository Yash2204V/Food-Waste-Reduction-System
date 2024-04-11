!pip install langchain
!pip install pinecone-client
!pip install pypdf
!pip install openai
!pip install -q google-generativeai

from langchain.document_loaders import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import GooglePalmEmbeddings
from langchain.llms import GooglePalm
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import pinecone
import os
import sys

!mkdir pdfs

!gdown 1iqX-MBwALI060SRzoQ3S62K_oU_gYvBY -O pdfs/Nutrition-Guide.pdf
!gdown 1X6qaaY4iXB1Yj74Ac5BVpZV29wDS0iIa -O pdfs/Handbook.pdf

loader = PyPDFDirectoryLoader("pdfs")
data = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)
text_chunks = text_splitter.split_documents(data)
len(text_chunks)

os.environ['GOOGLE_API_KEY'] = 'AIzaSyAUctjkvs1mhvvtEJBM4DYyGUaBRh4g4NM'
embeddings=GooglePalmEmbeddings()

from pinecone import Pinecone

# Set the PINECONE_API_KEY and PINECONE_API_ENV environment variables
os.environ["PINECONE_API_KEY"] = "f05d5492-d506-4ad0-be1b-694a541bb583"
os.environ["PINECONE_API_ENV"] = "gcp-starter"
os.environ["PINECONE_INDEX_NAME"]="food-safety-bot"
# Initialize the Pinecone object
pinecone = Pinecone()

#initial embeddings
#from langchain.vectorstores import Pinecone as PC
#docsearch = PC.from_texts([t.page_content for t in text_chunks], embeddings, index_name='food-safety-bot')

#after embedding process is completed we can use this instead of previous cell
from langchain.vectorstores import Pinecone as PC
docsearch = PC.from_existing_index('food-safety-bot', embeddings)

from langchain.llms import OpenAI 
llm = OpenAI(temperature=0.1 , openai_api_key='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')

qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=docsearch.as_retriever())

prompt_template  = """
Use the following piece of context to answer the question. Please provide a detailed response for each of the question.
dont use too much jargon, make it more easy to read and simplified
{context}

Question: {question}

Answer in English"""

prompt = PromptTemplate(template = prompt_template , input_variables=["context", "question"])


while True:
  user_input = input(f"Input Prompt: ")
  if user_input == 'exit':
    print('Exiting')
    sys.exit()
  if user_input == '':
    continue
  result = qa({'query': user_input})
  print(f"Answer: {result['result']}")

