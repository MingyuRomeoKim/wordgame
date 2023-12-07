// GameContainer 컴포넌트
import React , { useState, useEffect } from 'react';
import WordGame from "../WordGame";

const GameContainer = () => {
    const words = ['코스피','다음','방산','수출','수주','잔고','루마니아','레드','회사','한화'];
    const [currentWord, setCurrentWord] = useState('');

    useEffect(() => {
        if (words.length > 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            setCurrentWord(randomWord);
        }
    }, []);

    return (
        <div style={{width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '50vw', height: '50vw', maxWidth: '100%', aspectRatio: '1 / 1'}} title="Word Game">
                <WordGame words={words} currentWord={currentWord} setCurrentWord={setCurrentWord}/>
            </div>
        </div>
    );
};

export default GameContainer;
