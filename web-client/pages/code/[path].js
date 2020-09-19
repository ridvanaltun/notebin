import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// Components
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import SyntaxHighlighter from 'react-syntax-highlighter'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'

// Custom Components
import { Blank, CodePreviewToolbar } from '../../components'

// Redux
import { useDispatch } from 'react-redux'
import { setTitle } from '../../store/actions/appAction'

const Content = ({ code, language, onLanguageChange }) => {
  if (code) {
    return (
      <Box m={5}>
        <InputLabel id="demo-simple-select-label">Language</InputLabel>
        <Select
          labelId="code-select-label"
          id="code-select"
          value={language}
          onChange={onLanguageChange}
        >
          <MenuItem value="javascript">JavaScript</MenuItem>
          <MenuItem value="php">PHP</MenuItem>
          <MenuItem value="python">Python</MenuItem>
        </Select>
        <Box m={5}>
          <SyntaxHighlighter language={language}>
            {code}
          </SyntaxHighlighter>
        </Box>
      </Box>
    )
  }

  return <Blank />
}

Content.propTypes = {
  code: PropTypes.string,
  language: PropTypes.string,
  onLanguageChange: PropTypes.func
}

const CodePreview = ({ note }) => {
  const dispatch = useDispatch()

  // States
  const [code, setCode] = useState('javascript')

  // Change App Title
  useEffect(() => { dispatch(setTitle('Code Preview')) }, [])

  const handleCodeChange = (event) => {
    setCode(event.target.value)
  }

  return (
    <>
      <CodePreviewToolbar />
      <Content
        language={code}
        code={note}
        onLanguageChange={handleCodeChange}
      />
    </>
  )
}

CodePreview.getInitialProps = async (ctx) => {
  const { path } = ctx.query
  // const res = await axios.get('https://api.github.com/repos/vercel/next.js')
  // const data = await res.data
  return { note: path }
}

CodePreview.propTypes = {
  note: PropTypes.string
}

export default CodePreview
