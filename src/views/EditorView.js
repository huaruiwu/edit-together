import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firebase, firebaseConnect, dataToJS } from 'react-redux-firebase'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/javascript'
import 'brace/mode/java'
import 'brace/mode/python'
import 'brace/mode/ruby'
import 'brace/mode/mysql'
import 'brace/mode/json'
import 'brace/mode/html'
import 'brace/mode/golang'
import 'brace/mode/css'

import 'brace/theme/monokai'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'

const languages = [
    'javascript',
    'java',
    'python',
    'ruby',
    'mysql',
    'json',
    'html',
    'golang',
    'css'
]

class EditorView extends Component {
    constructor(props) {
        super(props)
        this.onChangeText = this.onChangeText.bind(this)
        this.setMode = this.setMode.bind(this)
        this._getID = this._getID.bind(this)
        this.state = {
            mode: 'javascript'
        }
    }

    _getID() {
        const { location } = this.props
        return location.pathname.slice(1)
    }

    render() {
        const { editors } = this.props
        const { mode } = this.state
        const id = this._getID()

        return (
            <div>
                <Link to="/">
                    <h4>Edit Together</h4>
                </Link>
                <div className="field">
                    <p className="control">
                        <span className="select">
                            <select
                                name="mode"
                                onChange={this.setMode}
                                value={mode}
                            >
                                {languages.map(lang => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </span>
                    </p>
                </div>
                <AceEditor
                    style={{
                        width: '100%',
                        height: '680px'
                    }}
                    mode={mode}
                    theme="monokai"
                    name="editor"
                    onChange={this.onChangeText}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={editors[id] || ''}
                    setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 4
                    }}
                />
            </div>
        )
    }

    setMode(e) {
        this.setState({
            mode: e.target.value
        })
    }

    onChangeText(newValue) {
        const { firebase } = this.props
        const id = this._getID()
        firebase.set(`editors/${id}`, newValue)
    }
}

export default compose(
    firebaseConnect(props => {
        const id = props.location.pathname.slice(1)
        return [`editors/${id}`]
    }),
    connect(({ firebase }) => ({
        editors: dataToJS(firebase, 'editors', {})
    }))
)(EditorView)
