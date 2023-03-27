import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import { ArrowRight } from 'react-feather'

const logoImg = '/assets/images/logo.svg'

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

const SYSTEM_PROMPT = 'You are an extremely resourceful human being, trained to assist and answer questions and give information.'
// const SYSTEM_PROMPT = 'You are Charlie Chaplin, and will only give sarcastic and funny answers.'

export default function Home() {

  const [isSearchView, setIsSearchView] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [chat, setChat] = useState([])

  const doSearch = () => {
    if (searchInput.trim() === '') {
      return
    }
    setIsSearchView(true)
    setIsSearching(true)

    const question = {
      role: 'user',
      content: searchInput
    }

    axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: SYSTEM_PROMPT},
          ...chat,
          question
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + OPENAI_API_KEY
        }
      }
    )
    .then(result => {
      console.log(result.data.choices[0])
      const answer = result.data.choices[0].message
      setChat(prevChat => [...prevChat, question, answer])
      setSearchInput('')
      setIsSearching(false)
    })
  }

  console.log(chat)

  return (
    <>
      <Head>
        <title>Querie — Simplest way to ask ChatGPT</title>
        <meta name="description" content="Ask anything to ChatGPT, in a friendly search engine style interface." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`main-content ${isSearchView ? 'search' : ''}`}>
        <div className='search-bar-content'>
          <div className='search-bar-holder'>
            <div className='search-view-holder'>
              <img 
                src={logoImg} 
                className='logo-img'
                onClick={() => {
                  setIsSearchView(false)
                }} />
              <div className='mini-search-bar'>
                <input 
                  className='search-input'
                  placeholder='Ask a new or follow-up question...'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      doSearch()
                    }
                  }}
                  value={searchInput}
                  onInput={(e) => setSearchInput(e.target.value)}  />
                <ArrowRight 
                  className={`go-icon ${searchInput.trim() === '' ? 'disabled' : ''}`}
                  strokeWidth={3}
                  onClick={doSearch} />
              </div>
            </div>
            <span className='subtext'>The simplest way to ask ChatGPT</span>
            <div className='search-bar'>
              <input 
                className='search-input'
                placeholder='Ask anything...'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    doSearch()
                  }
                }}
                value={searchInput}
                onInput={(e) => setSearchInput(e.target.value)}  />
              <ArrowRight 
                className={`go-icon ${searchInput.trim() === '' ? 'disabled' : ''}`} 
                strokeWidth={3}
                onClick={doSearch} />
            </div>
          </div>
        </div>
        <div className='results-content'>
          <span className='section-title'>ChatGPT Response</span>
          <ul className='chat-results'>
            <li className='main-card'>
              {
                !isSearching && chat.length > 1 ? (
                  <>
                    <span className='question-text'>{chat[chat.length-2].content}</span>
                    <p className='reply-text'>
                      {chat[chat.length-1].content}
                    </p>
                  </>
                ) : (
                  <div className='loading-holder'>
                    <div className='brick shimmer thick' />
                    <br />
                    <div className='brick shimmer' style={{width: '100%'}} />
                    <div className='brick shimmer' style={{width: '80%'}} />
                    <div className='brick shimmer' style={{width: '90%'}} />
                    <br />
                    <div className='brick shimmer' style={{width: '75%'}} />
                    <div className='brick shimmer' style={{width: '95%'}} />
                    <br />
                    <div className='brick shimmer' style={{width: '60%'}} />
                    <div className='brick shimmer' style={{width: '45%'}} />
                  </div>
                )
              }
            </li>
          </ul>
        </div>
      </main>
    </>
  )
}
