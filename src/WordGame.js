import React, {useState, useEffect} from 'react';

const WordGame = ({words, currentWord, setCurrentWord}) => {

    // 각 단어의 설명을 저장할 상태
    const [descriptions, setDescriptions] = useState({});
    // 현재 단어의 설명
    const [currentDescription, setCurrentDescription] = useState('');
    // 사용자 입력
    const [userInput, setUserInput] = useState('');
    // 현재 힌트 인덱스와 최대 힌트 횟수
    const [hintIndex, setHintIndex] = useState(0);
    const maxHints = 9;

    // API 호출 함수
    const fetchDescription = async (word) => {
        const query = word;
        const url = `http://127.0.0.1:8000/api/v1/naver/${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'default'
            });

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();
            const newDescription = processDescription(result.items[hintIndex].description);
            setDescriptions(result.items);

            return newDescription; // 첫 번째 검색 결과의 설명을 반환
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            return '설명을 불러오는데 실패했습니다.';
        }
    };

    // 단어 설명 가져오기 및 현재 단어 설정
    useEffect(() => {
        if (currentWord) {
            const loadData = async () => {
                // Json FIle 사용 로직
                // try {
                //     const result = await import(`./data/${currentWord}.json`);
                //     const newDescription = processDescription(result.items[hintIndex].description);
                //     setCurrentDescription(newDescription);
                //     setDescriptions(result.items);
                // } catch (err) {
                //     fetchDescription(currentWord).then(desc => {
                //         setCurrentDescription(desc);
                //     });
                // }

                fetchDescription(currentWord).then(desc => {
                    setCurrentDescription(desc);
                });
            };

            loadData();
        }
    }, [currentWord]);

    // 입력 처리 함수
    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    // 제출 처리 함수
    const handleSubmit = () => {
        if (userInput === currentWord) {
            const newWord = words[Math.floor(Math.random() * words.length)];
            setCurrentWord(newWord);
            alert(`정답입니다!`);
            setHintIndex(0);
            setUserInput('');
        } else {
            alert('틀렸습니다. 다시 시도해보세요.');
            setUserInput('');
        }
    };

    // 힌트 더보기 기능
    const moreHint = () => {

        if (hintIndex < maxHints) {
            const nextHintIndex = hintIndex + 1;
            setHintIndex(nextHintIndex);

            if (descriptions[nextHintIndex]) {
                const newDescription = processDescription(descriptions[nextHintIndex].description);
                setCurrentDescription(newDescription);
            }
        } else {
            alert('더 이상 힌트를 제공할 수 없습니다.');
        }
    };


    const processDescription = (description) => {
        const wordRegex = new RegExp(`<b>${currentWord}</b>`, 'gi'); // 'g'는 전역 검색, 'i'는 대소문자 구분 없음
        const wordLength = currentWord.length;
        const replacement = '?'.repeat(wordLength);
        const newDescription = description.replace(wordRegex, '[' + replacement + "]");
        return newDescription;
    }


    return (
        <div className="game-container" style={{padding: '20px', textAlign: 'center'}}>
            <h2>낱말 맞추기 게임</h2>
            <p>다음 설명에 맞는 단어는 무엇일까요?</p>
            <p dangerouslySetInnerHTML={{ __html: currentDescription }}></p>

            <input className="game-input" type="text" value={userInput} onChange={handleInputChange}/>
            <p>보기 : {words.join(', ')}</p>
            <div style={{display:'felx', justifyContent: 'center'}}>
                <button className="game-button" onClick={handleSubmit}>제출</button>
                &nbsp;&nbsp;
                <button className="game-button" onClick={moreHint}>힌트</button>
            </div>
        </div>
    );
};

export default WordGame;

