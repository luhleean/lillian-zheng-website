import { getChatGPTUser, chatGPTSignInPath } from '@/app/chatgpt-auth';
import Flashcards from './workspace';
import './flashcards.css';
import { Pixelify_Sans } from 'next/font/google';
const pixel = Pixelify_Sans({subsets:['latin'],variable:'--font-pixel'});
export const dynamic = 'force-dynamic';
export const metadata = {title:'Flashcards · Lillian Zheng',description:'Your classes, your cards, your next breakthrough. Create and study private flashcard sets.'};
export default async function Page() { const user = await getChatGPTUser(); return <div className={pixel.variable}><Flashcards signedIn={!!user} displayName={user?.displayName ?? ''} signInUrl={chatGPTSignInPath('/flashcards')}/></div>; }
