function analyzeQuestions(questions) {
    if(questions.length == 0){
        return {
            mostUsedChapter: "None",
            leastUsedChapter: "None",
            totalQuestions: "None"
        }
    }else{
    const chapterCounts = {};
    let totalQuestions = questions.length;

    // Count occurrences of each chapter
    questions.forEach(question => {
        const chapter = question.unit; // Change 'chapter' to the actual property name in your data
        chapterCounts[chapter] = (chapterCounts[chapter] || 0) + 1;
    });

    // Find the most used and least used chapters
    const mostUsedChapter = Object.keys(chapterCounts).reduce((a, b) => chapterCounts[a] > chapterCounts[b] ? a : b);
    const leastUsedChapter = Object.keys(chapterCounts).reduce((a, b) => chapterCounts[a] < chapterCounts[b] ? a : b);

    return {
        mostUsedChapter: mostUsedChapter,
        leastUsedChapter: leastUsedChapter,
        totalQuestions: totalQuestions
    };
}
}

document.addEventListener("DOMContentLoaded", function () {
    fetch('/questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secret: secret })
    })
    .then((response) => response.json())
    .then((questions1) => {
        function getTopic(cookie) {
            if (!cookie) {
              alert("NO COOKIE PROVIDED");
              return Promise.reject("NO COOKIE PROVIDED");
            }
          
            return fetch('/get-topic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ secret: secret, cookie: cookie })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                const username = data.teachingTopic;
                return username || null;
            })
            .catch(function(error) {
                // Handle errors here
                console.error(error);
                throw error;
            });
          }
          const cookie11 = getCookie("EDUHOME-COOKIE")
          const topicPromise = getTopic(cookie11);

  return topicPromise
    .then((topic) => {
    
        const questions = questions1.filter(question => question.topic == topic)
    
        const analysisResult = analyzeQuestions(questions);
        document.getElementById("mostUsedChapter").textContent = analysisResult.mostUsedChapter;
        document.getElementById("leastUsedChapter").textContent = analysisResult.leastUsedChapter;
        document.getElementById("totalQuestions").textContent = analysisResult.totalQuestions;
    })

    });
});
