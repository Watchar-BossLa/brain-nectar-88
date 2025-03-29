
import { QuizSessionSummary } from '@/types/quiz-session';

export const exportToCSV = (sessions: QuizSessionSummary[]) => {
  const headers = ['Date', 'Score', 'Correct Answers', 'Total Questions', 'Time Spent', 'Difficulty', 'Topics'];
  const csvContent = sessions.map(session => {
    const timeInMinutes = Math.floor(session.timeSpent / 60000);
    const timeInSeconds = Math.floor((session.timeSpent % 60000) / 1000);
    return [
      new Date(session.date).toLocaleString(),
      `${session.scorePercentage}%`,
      session.correctAnswers,
      session.totalQuestions,
      `${timeInMinutes}m ${timeInSeconds}s`,
      session.difficulty,
      session.topics.join(', ')
    ].join(',');
  });
  
  const csv = [headers.join(','), ...csvContent].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quiz-history-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = async (sessions: QuizSessionSummary[]) => {
  const content = sessions.map(session => {
    const timeInMinutes = Math.floor(session.timeSpent / 60000);
    const timeInSeconds = Math.floor((session.timeSpent % 60000) / 1000);
    return {
      date: new Date(session.date).toLocaleString(),
      score: `${session.scorePercentage}%`,
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      timeSpent: `${timeInMinutes}m ${timeInSeconds}s`,
      difficulty: session.difficulty,
      topics: session.topics.join(', ')
    };
  });

  // Use browser's print functionality as a simple PDF export solution
  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Quiz History</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>Quiz History Export</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Score</th>
              <th>Correct/Total</th>
              <th>Time Spent</th>
              <th>Difficulty</th>
              <th>Topics</th>
            </tr>
          </thead>
          <tbody>
            ${content.map(session => `
              <tr>
                <td>${session.date}</td>
                <td>${session.score}</td>
                <td>${session.correctAnswers}/${session.totalQuestions}</td>
                <td>${session.timeSpent}</td>
                <td>${session.difficulty}</td>
                <td>${session.topics}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};
