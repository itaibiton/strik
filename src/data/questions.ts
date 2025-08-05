import { Question } from '@/types';

export const sampleQuestions: Question[] = [
  {
    id: '1',
    text: 'Name a player who has played with Cristiano Ronaldo at Real Madrid',
    acceptedAnswers: [
      'sergio ramos', 'ramos', 'luka modric', 'modric', 'gareth bale', 'bale',
      'karim benzema', 'benzema', 'toni kroos', 'kroos', 'marcelo', 'casemiro',
      'isco', 'james rodriguez', 'james', 'pepe', 'xabi alonso', 'alonso'
    ],
    difficulty: 'easy',
    category: 'Real Madrid',
    timeLimit: 30,
    hint: 'Think of famous Real Madrid players from 2009-2018'
  },
  {
    id: '2',
    text: 'Name a player who has won the World Cup with Brazil',
    acceptedAnswers: [
      'ronaldinho', 'kaka', 'roberto carlos', 'cafu', 'ronaldo nazario', 'ronaldo',
      'rivaldo', 'romario', 'bebeto', 'dunga', 'taffarel', 'jorginho', 'zico',
      'socrates', 'falcao', 'cerezo', 'junior', 'oscar', 'lucio', 'gilberto silva'
    ],
    difficulty: 'medium',
    category: 'World Cup',
    timeLimit: 25,
    hint: 'Brazil won the World Cup in 1958, 1962, 1970, 1994, and 2002'
  },
  {
    id: '3',
    text: 'Name a defender who has played in both the Premier League and Serie A',
    acceptedAnswers: [
      'giorgio chiellini', 'chiellini', 'andrea barzagli', 'barzagli', 'patrice evra', 'evra',
      'ashley cole', 'cole', 'gael clichy', 'clichy', 'bacary sagna', 'sagna',
      'mario balotelli', 'balotelli', 'carlos tevez', 'tevez', 'paul pogba', 'pogba'
    ],
    difficulty: 'hard',
    category: 'Transfers',
    timeLimit: 20,
    hint: 'Think of players who moved between English and Italian football'
  },
  {
    id: '4',
    text: 'Name a player who scored in a Champions League final',
    acceptedAnswers: [
      'lionel messi', 'messi', 'cristiano ronaldo', 'ronaldo', 'gareth bale', 'bale',
      'sergio ramos', 'ramos', 'mario mandzukic', 'mandzukic', 'mo salah', 'salah',
      'sadio mane', 'mane', 'divock origi', 'origi', 'samuel etoo', 'etoo',
      'thierry henry', 'henry', 'david villa', 'villa', 'pedro', 'xavi', 'iniesta'
    ],
    difficulty: 'medium',
    category: 'Champions League',
    timeLimit: 25,
    hint: 'Many different players have scored in Champions League finals'
  },
  {
    id: '5',
    text: 'Name a goalkeeper who has played for Manchester United',
    acceptedAnswers: [
      'david de gea', 'de gea', 'andre onana', 'onana', 'dean henderson', 'henderson',
      'edwin van der sar', 'van der sar', 'peter schmeichel', 'schmeichel',
      'alex stepney', 'stepney', 'harry gregg', 'gregg', 'sergio romero', 'romero'
    ],
    difficulty: 'easy',
    category: 'Manchester United',
    timeLimit: 30,
    hint: 'Think of current and former Manchester United goalkeepers'
  },
  {
    id: '6',
    text: 'Name a player who has played for both Barcelona and PSG',
    acceptedAnswers: [
      'neymar', 'neymar jr', 'lionel messi', 'messi', 'dani alves', 'alves',
      'maxwell', 'javier pastore', 'pastore', 'lucas digne', 'digne',
      'rafinha', 'sergi roberto', 'roberto'
    ],
    difficulty: 'medium',
    category: 'Transfers',
    timeLimit: 25,
    hint: 'Several high-profile transfers have happened between these clubs'
  },
  {
    id: '7',
    text: 'Name a striker who has scored over 100 goals in their career',
    acceptedAnswers: [
      'lionel messi', 'messi', 'cristiano ronaldo', 'ronaldo', 'robert lewandowski', 'lewandowski',
      'karim benzema', 'benzema', 'harry kane', 'kane', 'sergio aguero', 'aguero',
      'zlatan ibrahimovic', 'ibrahimovic', 'thierry henry', 'henry', 'david villa', 'villa',
      'francesco totti', 'totti', 'gerd muller', 'muller', 'pele', 'diego maradona', 'maradona'
    ],
    difficulty: 'easy',
    category: 'Goal Scorers',
    timeLimit: 30,
    hint: 'Many world-class strikers have achieved this milestone'
  },
  {
    id: '8',
    text: 'Name a player who has won the Ballon dOr',
    acceptedAnswers: [
      'lionel messi', 'messi', 'cristiano ronaldo', 'ronaldo', 'luka modric', 'modric',
      'kaka', 'ronaldinho', 'zinedine zidane', 'zidane', 'rivaldo', 'ronaldo nazario',
      'michael owen', 'owen', 'luis figo', 'figo', 'roberto baggio', 'baggio',
      'jean-pierre papin', 'papin', 'karim benzema', 'benzema'
    ],
    difficulty: 'medium',
    category: 'Awards',
    timeLimit: 25,
    hint: 'The most prestigious individual award in football'
  },
  {
    id: '9',
    text: 'Name a player who has captained their national team',
    acceptedAnswers: [
      'lionel messi', 'messi', 'cristiano ronaldo', 'ronaldo', 'sergio ramos', 'ramos',
      'virgil van dijk', 'van dijk', 'harry kane', 'kane', 'kylian mbappe', 'mbappe',
      'manuel neuer', 'neuer', 'giorgio chiellini', 'chiellini', 'thiago silva', 'silva',
      'luka modric', 'modric', 'eden hazard', 'hazard', 'kevin de bruyne', 'de bruyne'
    ],
    difficulty: 'easy',
    category: 'National Teams',
    timeLimit: 30,
    hint: 'Many star players captain their countries'
  },
  {
    id: '10',
    text: 'Name a player who has played in the Premier League, La Liga, and Serie A',
    acceptedAnswers: [
      'angel di maria', 'di maria', 'carlos tevez', 'tevez', 'alvaro morata', 'morata',
      'pedro', 'cesc fabregas', 'fabregas', 'andrea pirlo', 'pirlo', 'frank lampard', 'lampard',
      'fernando torres', 'torres', 'diego costa', 'costa'
    ],
    difficulty: 'hard',
    category: 'Transfers',
    timeLimit: 20,
    hint: 'Very few players have played in all three of these top leagues'
  },
];