export const quizData = {
  title: "Network Protocol Adventure",
  description: "Help the computer find its way through the network!",
  questions: [
    {
      id: 1,
      question:
        "I need an address to talk to other computers. What should I use?",
      correct: "DHCP",
      explanation:
        "DHCP gives computers their network addresses automatically!",
      difficulty: "easy",
    },
    {
      id: 2,
      question:
        "I want to find the internet phonebook and main path. Which helper should I ask?",
      correct: "DHCP",
      explanation:
        "DHCP can tell computers where to find DNS servers and the default route.",
      difficulty: "medium",
    },
    {
      id: 3,
      question:
        "I need to know my friend's special hardware number. Who can help me find it?",
      correct: "ARP",
      explanation:
        "ARP helps computers find each other's hardware (MAC) addresses!",
      difficulty: "easy",
    },
    {
      id: 4,
      question:
        "We have 25 devices but only one public address. How can we all use the internet?",
      correct: "NAT",
      explanation:
        "NAT lets many devices share one public IP address - like a big family sharing one phone!",
      difficulty: "medium",
    },
    {
      id: 5,
      question:
        "I'm curious about the path my messages take to reach faraway servers. What can show me?",
      correct: "ICMP",
      explanation:
        "ICMP helps trace the route messages take across the internet!",
      difficulty: "hard",
    },
    {
      id: 6,
      question:
        "I want to play 'ping pong' with another computer to check if we can talk. What lets me do this?",
      correct: "ICMP",
      explanation:
        "The ping command uses ICMP to test connections between computers!",
      difficulty: "easy",
    },
  ],
  allChoices: ["ARP", "DHCP", "ICMP", "NAT"],
  config: {
    shuffleQuestions: true,
    shuffleAnswers: true,
    timePerQuestion: 15,
    maxLives: 3,
    difficultyLevels: {
      easy: { timeBonus: 5 },
      medium: { timeBonus: 3 },
      hard: { timeBonus: 0 },
    },
  },
  rewards: {
    perfectScore: {
      message: "Network Wizard!",
      badge: "THM{{computer_is_happy}}",
    },
    goodScore: {
      threshold: 0.7,
      message: "Tech Explorer!",
      badge: "THM{{almost_there}}",
    },
  },
};

export const getQuizData = (options = {}) => {
  let questions = [...quizData.questions];

  if (options.difficulty) {
    questions = questions.filter((q) => q.difficulty === options.difficulty);
  }

  if (quizData.config.shuffleQuestions) {
    questions = shuffleArray(questions);
  }

  return {
    ...quizData,
    questions,
    config: {
      ...quizData.config,
      ...options.config,
    },
  };
};
