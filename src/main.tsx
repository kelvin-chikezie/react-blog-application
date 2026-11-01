import React,{Suspense,lazy} from 'react'
import ReactDOM from 'react-dom/client'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import {createRootRoute,createRoute,createRouter,Outlet,RouterProvider} from '@tanstack/react-router'
import {SiteHeader} from './components/SiteHeader'
import {SiteFooter} from './components/SiteFooter'
import {ErrorBoundary} from './components/ErrorBoundary'
import './styles.css'
const HomePage=lazy(()=>import('./routes/HomePage'))
const PostPage=lazy(()=>import('./routes/PostPage'))
const NewPostPage=lazy(()=>import('./routes/NewPostPage'))
const NotFoundPage=lazy(()=>import('./routes/NotFoundPage'))
function RouteLoader(){return <div className="route-loader"><span/> Preparing your reading nook…</div>}
function RootLayout(){return <><SiteHeader/><Suspense fallback={<RouteLoader/>}><Outlet/></Suspense><SiteFooter/></>}
const rootRoute=createRootRoute({component:RootLayout,notFoundComponent:NotFoundPage})
const indexRoute=createRoute({getParentRoute:()=>rootRoute,path:'/',component:HomePage})
const postRoute=createRoute({getParentRoute:()=>rootRoute,path:'/posts/$postId',component:PostPage})
const newPostRoute=createRoute({getParentRoute:()=>rootRoute,path:'/new',component:NewPostPage})
const routeTree=rootRoute.addChildren([indexRoute,postRoute,newPostRoute])
const router=createRouter({routeTree,defaultPreload:'intent'})
declare module '@tanstack/react-router'{interface Register{router:typeof router}}
const queryClient=new QueryClient({defaultOptions:{queries:{retry:1,staleTime:60_000,refetchOnWindowFocus:false}}})
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ErrorBoundary><QueryClientProvider client={queryClient}><RouterProvider router={router}/></QueryClientProvider></ErrorBoundary></React.StrictMode>)