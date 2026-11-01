import React from 'react'
import {AlertCircle,RefreshCw} from 'lucide-react'
interface Props{children:React.ReactNode}
interface State{hasError:boolean}
export class ErrorBoundary extends React.Component<Props,State>{state:State={hasError:false};static getDerivedStateFromError():State{return{hasError:true}};componentDidCatch(error:Error){console.error('Application error:',error)};render(){if(this.state.hasError)return <main className="state-page"><div className="state-icon"><AlertCircle size={22}/></div><h1>Something went wrong.</h1><p>We could not render this page. Try refreshing it.</p><button className="button button-dark" onClick={()=>window.location.reload()}><RefreshCw size={15}/> Refresh page</button></main>;return this.props.children}}