import AccessPopup from '@/components/AccessPopup'
import EnhancePopup from '@/components/EnhancePopup'
import { DEFAULT_SYSTEM_PROMPT } from '@/constants'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { ArrowRight, Loader, Moon, Unlock } from 'react-feather'

const logoImg = '/assets/images/logo.svg'
const logoDarkImg = '/assets/images/logo-dark.svg'

const QUERIE_OPENAI_API_KEY = 'QUERIE_OPENAI_API_KEY'

export default function Home() {

  // OpenAI API Key
  const [openAIKey, setOpenAIKey] = useState(undefined)
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)

  const [isSearchView, setIsSearchView] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isAccessPopupOpen, setIsAccessPopupOpen] = useState(false)
  const [isEnhancePopupOpen, setIsEnhancePopupOpen] = useState(false) 
  const [searchInput, setSearchInput] = useState('')
  const [chat, setChat] = useState([])

  useEffect(() => {
    if (!openAIKey) {
      // Perform localStorage action
      const apiKeyValue = localStorage.getItem(QUERIE_OPENAI_API_KEY)
      console.log(apiKeyValue)
      setOpenAIKey(apiKeyValue)
    }
  }, [])

  const saveOpenAIKey = (key) => {
    if (key) {
      localStorage.setItem(QUERIE_OPENAI_API_KEY, key)
      setOpenAIKey(key)
    }
  }

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
          {role: 'system', content: systemPrompt},
          ...chat,
          question
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + openAIKey
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

  const openAccessPopup = () => {
    setIsAccessPopupOpen(true)
  }
  const closeAccessPopup = () => {
    setIsAccessPopupOpen(false)
  }

  const openEnhancePopup = () => {
    setIsEnhancePopupOpen(true)
  }
  const closeEnhancePopup = () => {
    setIsEnhancePopupOpen(false)
  }

  return (
    <>
      <Head>
        <title>Querie — Simplest way to ask ChatGPT</title>
        <meta name="description" content="Ask anything to ChatGPT, in a friendly search engine style interface." />
        <meta name="viewport" content="width=device-width, height=device-height,  initial-scale=1.0, user-scalable=no;user-scalable=0;"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`main-content ${isSearchView ? 'search' : ''} ${isDarkMode ? 'dark' : ''}`}>
        <button 
          className='dark-mode-btn'
          onClick={() => setIsDarkMode(!isDarkMode)}>
          <Moon className='moon-icon' strokeWidth={2} />
        </button>
        <div className='search-bar-content'>
          <div className='search-bar-holder'>
            <div className='search-view-holder'>
              <img 
                src={isDarkMode ? logoDarkImg : logoImg} 
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
                    if (openAIKey) {
                      doSearch()
                    } else {
                      openAccessPopup()
                    }
                  }
                }}
                value={searchInput}
                onInput={(e) => setSearchInput(e.target.value)}  />
              {
                openAIKey ? (
                  <ArrowRight 
                    className={`go-icon ${searchInput.trim() === '' ? 'disabled' : ''}`} 
                    strokeWidth={3}
                    onClick={doSearch} />
                ) : (
                  <Unlock 
                    className='unlock-icon'
                    strokeWidth={3}
                    onClick={openAccessPopup} />
                )
              }
            </div>

            <button 
              className='enhance-btn'
              onClick={openEnhancePopup}>
              <Loader className='loader-icon' strokeWidth={3} />
              <span>Enhance</span>
            </button>

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

        <AccessPopup
          isOpen={isAccessPopupOpen}
          closePopup={closeAccessPopup}
          saveOpenAIKey={saveOpenAIKey} />

        <EnhancePopup
          isOpen={isEnhancePopupOpen}
          closePopup={closeEnhancePopup}
          promptInput={systemPrompt}
          setPromptInput={setSystemPrompt} />
      
      </main>
    </>
  )
}
