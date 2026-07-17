/*
  QUESTION BANK
  -------------
  Each question has:
    text      -> the question shown to the student
    keywords  -> words/concepts a good answer is expected to mention
                 (used by the scoring engine in interview.js)
    expectedWords -> roughly how long a solid spoken/written answer should be
*/

const QUESTION_BANK = {
  "Frontend Developer": {
    HR: [
      { text: "Tell me about yourself.", keywords: ["student","project","skill","learn","developer","college"], expectedWords: 40 },
      { text: "Why do you want to work as a Frontend Developer?", keywords: ["ui","design","user","interface","interest","css","javascript"], expectedWords: 35 },
      { text: "Describe a challenge you faced in a project and how you solved it.", keywords: ["problem","debug","solution","learn","fixed","issue"], expectedWords: 40 },
      { text: "Where do you see yourself in two years?", keywords: ["grow","learn","skill","developer","team","career"], expectedWords: 30 }
    ],
    Technical: [
      { text: "What is the difference between HTML and semantic HTML?", keywords: ["tag","meaning","structure","accessibility","seo","header","section"], expectedWords: 30 },
      { text: "Explain the CSS box model.", keywords: ["margin","border","padding","content","width","height"], expectedWords: 30 },
      { text: "What is the difference between var, let, and const in JavaScript?", keywords: ["scope","block","reassign","hoisting","function"], expectedWords: 30 },
      { text: "What is the DOM and how does JavaScript interact with it?", keywords: ["document","object","model","element","tree","node","javascript"], expectedWords: 30 }
    ],
    Coding: [
      { text: "How would you center a div both vertically and horizontally using CSS?", keywords: ["flex","justify-content","align-items","grid","display"], expectedWords: 20 },
      { text: "Write the logic to reverse a string in JavaScript.", keywords: ["split","reverse","join","loop","function"], expectedWords: 20 },
      { text: "How would you make an API call in JavaScript and handle the response?", keywords: ["fetch","promise","async","await","json","response"], expectedWords: 25 },
      { text: "How would you check if an array contains duplicate values?", keywords: ["set","loop","index","includes","filter"], expectedWords: 20 }
    ]
  },

  "Backend Developer": {
    HR: [
      { text: "Tell me about yourself.", keywords: ["student","project","skill","learn","developer","college"], expectedWords: 40 },
      { text: "Why did you choose backend development?", keywords: ["logic","database","server","interest","problem","solving"], expectedWords: 35 },
      { text: "Describe a time you had to debug a difficult issue.", keywords: ["error","log","debug","fixed","issue","test"], expectedWords: 40 },
      { text: "How do you handle working under a deadline?", keywords: ["plan","priority","time","manage","team"], expectedWords: 30 }
    ],
    Technical: [
      { text: "What is the difference between SQL and NoSQL databases?", keywords: ["structured","schema","table","document","flexible","relational"], expectedWords: 30 },
      { text: "Explain what an API is.", keywords: ["request","response","server","client","endpoint","data"], expectedWords: 25 },
      { text: "What is the purpose of authentication vs authorization?", keywords: ["identity","login","permission","access","token","user"], expectedWords: 30 },
      { text: "What is a REST API?", keywords: ["http","get","post","stateless","resource","endpoint"], expectedWords: 30 }
    ],
    Coding: [
      { text: "How would you design a database table to store student records?", keywords: ["primary key","column","table","id","field","relation"], expectedWords: 25 },
      { text: "How would you write a query to find duplicate entries in a table?", keywords: ["group by","having","count","select","distinct"], expectedWords: 20 },
      { text: "How would you secure a login API from common attacks?", keywords: ["hash","password","token","validation","sql injection"], expectedWords: 25 },
      { text: "How would you handle an API that receives too many requests at once?", keywords: ["rate limit","queue","cache","load","scale"], expectedWords: 20 }
    ]
  },

  "Data Analyst / ML": {
    HR: [
      { text: "Tell me about yourself.", keywords: ["student","project","skill","learn","data","college"], expectedWords: 40 },
      { text: "Why are you interested in data / machine learning?", keywords: ["data","pattern","prediction","interest","python","analysis"], expectedWords: 35 },
      { text: "Describe a project where you analyzed data to find an insight.", keywords: ["data","insight","analysis","result","conclusion","chart"], expectedWords: 40 },
      { text: "How do you stay updated with new tools in data science?", keywords: ["learn","course","practice","read","online"], expectedWords: 30 }
    ],
    Technical: [
      { text: "What is the difference between supervised and unsupervised learning?", keywords: ["label","output","input","cluster","pattern","training"], expectedWords: 35 },
      { text: "What is overfitting in machine learning?", keywords: ["training","test","accuracy","generalize","noise","data"], expectedWords: 30 },
      { text: "What is the purpose of a training and testing split in ML?", keywords: ["train","test","evaluate","accuracy","model","data"], expectedWords: 30 },
      { text: "Explain what a confusion matrix shows.", keywords: ["true positive","false positive","accuracy","prediction","actual"], expectedWords: 30 }
    ],
    Coding: [
      { text: "How would you handle missing values in a dataset using Python?", keywords: ["pandas","dropna","fillna","mean","null"], expectedWords: 25 },
      { text: "How would you split a dataset into training and testing sets?", keywords: ["train_test_split","sklearn","ratio","random"], expectedWords: 20 },
      { text: "How would you evaluate the accuracy of a classification model?", keywords: ["accuracy","precision","recall","f1","confusion matrix"], expectedWords: 25 },
      { text: "How would you visualize the relationship between two variables?", keywords: ["scatter","plot","matplotlib","seaborn","chart"], expectedWords: 20 }
    ]
  }
};

// simple filler words used in the scoring engine to judge clarity/confidence
const FILLER_WORDS = ["um","uh","like","actually","basically","kind of","sort of","i think","maybe","idk"];