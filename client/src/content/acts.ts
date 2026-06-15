export type ActBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'pullquote'; text: string }
  | { type: 'coming-next'; text: string }
  | { type: 'stat-cards'; items: { stat: string; label: string }[] }
  | { type: 'two-col-table'; left: { title: string; body: string }; right: { title: string; body: string } }
  | { type: 'four-cards'; items: { title: string; body: string }[] }
  | { type: 'comparison-table'; leftTitle: string; rightTitle: string; leftItems: string[]; rightItems: string[] }
  | { type: 'property-grid'; items: { name: string; description: string }[] }
  | { type: 'comparison-matrix'; headers: [string, string, string]; rows: { prop: string; left: string; right: string }[] }
  | { type: 'faq-blocks'; items: { question: string; answer: string; category?: string }[] }
  | { type: 'insight-blocks'; items: { title: string; body: string }[] }
  | { type: 'book-cards'; items: { title: string; author: string; description: string; tag: string }[] }
  | { type: 'three-level'; title: string; levels: { label: string; body: string; link: { text: string; href: string; external: boolean } }[] }
  | { type: 'cta-panels'; left: { title: string; label: string; to: string; body?: string }; right: { title: string; label: string; body?: string; note?: string; href?: string; external?: boolean } };

export interface Act {
  n: number;
  title: string;
  description: string;
  blocks: ActBlock[];
}

export const ACTS: Act[] = [
  {
    n: 1,
    title: 'Why money exists — and why it matters more than you think',
    description: 'Trade, specialization, and the invention that made civilization possible',
    blocks: [
      {
        type: 'paragraph',
        text: 'Think about your morning. Coffee from beans grown in Colombia. A phone assembled in Asia from parts made on five continents. A commute on roads built by workers paid in wages, who bought tools made by other workers, who were paid in wages too.',
      },
      {
        type: 'paragraph',
        text: 'None of that happened by accident. It happened because humans trade — and have traded for as long as we have existed. Trading is so natural to us we barely notice it. But it is the single most important thing we do.',
      },
      {
        type: 'paragraph',
        text: 'Here is why. When people trade, something remarkable happens: they specialize. Instead of every family growing its own food, making its own clothes, and building its own shelter — each person does the thing they do best. A farmer grows more food than his family needs. A weaver makes more cloth than she can wear. They trade. Both are better off.',
      },
      {
        type: 'paragraph',
        text: 'That simple idea — specialization through trade — is the engine behind everything. The longer the chain of people cooperating through trade, the more complex and capable the things they can build together. Economists call this lengthening the lines of production. A single person cannot build a smartphone. But a global network of specialists, each trading their expertise, can.',
      },
      {
        type: 'pullquote',
        text: 'Every product you own, every service you use, every medicine that has ever saved a life — all of it exists because humans figured out how to trade with strangers they would never meet.',
      },
      {
        type: 'paragraph',
        text: 'Our modern world — with its hospitals, its infrastructure, its food abundance — is not the result of any single genius or government. It is the accumulated result of billions of trades, compounding over centuries.',
      },
      {
        type: 'paragraph',
        text: 'But classic barter trade has a problem. If you are a farmer with surplus wheat and you need shoes, you have to find a shoemaker who happens to need wheat — right now, today. This is called the double coincidence of wants, and it makes complex trade nearly impossible. You cannot build a global supply chain on barter.',
      },
      {
        type: 'paragraph',
        text: 'So humans invented something to solve this problem. Instead of trading goods directly, one side of every transaction would be a universally accepted go-between — something everyone would take, even if they personally did not need it, because they knew someone else would. A medium of exchange.',
      },
      { type: 'paragraph', text: 'We call it money.' },
      {
        type: 'paragraph',
        text: 'Money did not come from a government decree. It emerged naturally, from the bottom up, wherever people traded. Shells, cattle, salt, beads, and eventually metals — each community converged on whatever worked best as a go-between. Money is as human as language.',
      },
      {
        type: 'coming-next',
        text: 'Money made civilization possible. But not all money is equal. Some forms of money have a hidden property that, over time, quietly destroys the very trade it was meant to enable. So what makes money good — and what makes it dangerous?',
      },
    ],
  },

  {
    n: 2,
    title: 'What makes good money — and what makes it a weapon',
    description: 'The six properties that separate honest money from a tool of control',
    blocks: [
      {
        type: 'paragraph',
        text: "If you asked most people what money is, they would say something like 'whatever the government issues.' But the truth is, governments have issued all kinds of things as money throughout history — and most of them eventually failed. When money is instead allowed to emerge naturally, without government mandate, it tends to outlast anything decreed from above. Some forms of naturally emergent money have held their value for centuries.",
      },
      {
        type: 'paragraph',
        text: 'So what actually makes something good money? It turns out there is a clear answer — one that history has tested repeatedly. Good money needs to be several things reliably.',
      },
      {
        type: 'property-grid',
        items: [
          { name: 'Scarce', description: 'Cannot be created freely. If anyone can make more, it loses value.' },
          { name: 'Durable', description: 'Does not rot, rust, or degrade. It must store value across time.' },
          { name: 'Divisible', description: 'Can be split into smaller units to enable transactions of any size.' },
          { name: 'Fungible', description: 'Each unit is identical to every other. One dollar equals any other dollar.' },
          { name: 'Portable', description: 'Easy to carry and transfer. Wealth must be able to move.' },
          { name: 'Verifiable', description: 'Anyone can confirm its authenticity without special authority.' },
          { name: 'Decentralized', description: 'No single entity controls it. Control invites manipulation.' },
        ],
      },
      {
        type: 'paragraph',
        text: 'Nobody designed these requirements. They were discovered through trial and error across thousands of years of human commerce. The monies that survived were the ones that checked most of these boxes. The ones that failed were missing one or more.',
      },
      {
        type: 'paragraph',
        text: 'When you run this test against every money humans have ever used, one commodity rises above all others: gold. It is extraordinarily scarce — all the gold ever mined in history would fill roughly three and a half Olympic swimming pools. It does not corrode. It is divisible, fungible, and recognizable anywhere on earth. For most of recorded history, gold was the closest thing to perfect money the world had found.',
      },
      {
        type: 'pullquote',
        text: "Gold did not become the world's reserve money because kings decreed it. It became reserve money because it kept winning the competition. Every civilization that encountered it independently arrived at the same conclusion.",
      },
      {
        type: 'paragraph',
        text: 'But gold has one critical weakness. It is heavy. Moving large amounts across distances is slow, expensive, and dangerous. As trade became global and economies grew more complex, this became a serious problem.',
      },
      {
        type: 'two-col-table',
        left: {
          title: "Gold's strengths",
          body: 'Scarce, durable, divisible, fungible, verifiable, decentralized — the best natural money ever found.',
        },
        right: {
          title: "Gold's fatal flaw",
          body: 'Heavy and hard to transport. Moving large wealth across distances requires trust in a third party.',
        },
      },
      {
        type: 'paragraph',
        text: 'The solution seemed practical at the time: store the gold with trusted custodians — eventually banks — and carry paper certificates redeemable for gold instead. The paper was convenient. The gold stayed safe in a vault. Everyone won.',
      },
      {
        type: 'paragraph',
        text: 'Except the custodians noticed something. Most people never came to collect their gold all at once. So the custodians started issuing more certificates than they had gold to back them. A little at first. Then more. This practice became institutionalized as fractional reserve banking — a system in which banks hold only a fraction of deposits in reserve and lend out the rest, effectively creating new money with each loan. The only thing keeping banks close to honest was their obligation to redeem certificates for gold on demand. As long as that promise held, the system had a floor.',
      },
      {
        type: 'paragraph',
        text: 'But that floor kept getting lower. Governments, recognizing the power of the printing press, gradually took control of the money system. Central banks were established to manage the supply of money and act as lenders of last resort — a polite way of saying they could create money to bail out banks that had issued too many certificates. The gold constraint became increasingly inconvenient. On August 15, 1971, President Nixon officially severed the last link between the US dollar and gold. From that moment, there was no floor at all. Money could be created without limit, backed by nothing but the authority of the state.',
      },
      {
        type: 'paragraph',
        text: "Gold's fatal flaw did not just inconvenience us. It was the crack in the door through which an entirely different monetary system entered — one with no inherent constraint on how much money could be created.",
      },
      {
        type: 'coming-next',
        text: 'When the constraint on money creation disappears, something changes — not just in prices, but in wars, in inequality, in the quality of the things we build, and in how we think about the future. The consequences of unlimited money run much deeper than most people realize.',
      },
    ],
  },

  {
    n: 3,
    title: 'What bad money does to the world — the blast radius',
    description: 'From inflation to war — the hidden consequences of money that can be created freely',
    blocks: [
      {
        type: 'paragraph',
        text: 'Most people use the word inflation to describe rising prices. The instinctive explanation is that things are getting harder to make, or better in quality — and therefore more expensive. But look around. Technology makes production cheaper and more efficient every year. Computers, phones, and televisions cost less in real terms than they did a decade ago precisely because we got better at making them. If that logic held across the economy, most things should be getting cheaper over time, not more expensive. The fact that they are not points to something else entirely. Prices rise not because goods and services are gaining value — but because the money measuring them is losing it. A better word for this is debasement — the deliberate dilution of money\'s purchasing power through the creation of more of it. And crucially, the value that savers lose does not disappear. It is transferred — to those who created the new money and spent it first.',
      },
      {
        type: 'paragraph',
        text: "Here is the mechanism in plain terms. When new money is created, the eventual outcome will always be a general rise in prices — but that rise does not happen evenly or all at once. New money enters the economy through banks, governments, and large financial institutions first. These early recipients do not spend it randomly. They use it to acquire the very assets — real estate, equities, businesses — they know will rise in price as the new money spreads through the economy. They buy before prices have risen, capture the gains, and by the time that money filters down to ordinary wage earners, prices have already adjusted upward. Workers and savers do not see rising wages. They see rising costs. The purchasing power has been silently transferred — from those who hold money to those who were first in line to spend the new supply.",
      },
      {
        type: 'pullquote',
        text: "Inflation is not a tax that shows up on your bill. It is a tax that shows up when you realize your savings bought less than they used to — and nobody signed the legislation that took it.",
      },
      {
        type: 'paragraph',
        text: 'This effect has a name. Economists call it the Cantillon effect, after the 18th-century economist who first described it. It is not a conspiracy theory. It is a structural feature of how money creation works — and it has been widening the wealth gap for decades.',
      },
      {
        type: 'stat-cards',
        items: [
          { stat: '97%', label: 'Loss in US dollar purchasing power since the Federal Reserve was created in 1913' },
          { stat: '1971', label: 'Year the last link between the US dollar and gold was severed — money creation became unlimited' },
          { stat: 'Top 1%', label: 'Now owns more wealth than the entire bottom 90% — a gap that has widened steadily since 1971' },
        ],
      },
      {
        type: 'paragraph',
        text: 'But the damage does not stop at your wallet. Unlimited money creation distorts nearly every corner of society in ways most people never connect back to their source.',
      },
      {
        type: 'four-cards',
        items: [
          {
            title: 'War becomes affordable',
            body: "Under hard money, wars had to be paid for — through taxes citizens could see and feel, or through borrowing that had real limits. Governments that could not afford to fight had to stop fighting. Under fiat money, wars can be financed by printing. The true cost is socialized across the entire population through inflation — a hidden tax spread across every citizen's savings and wages, without a vote or a bill. Hard money did not eliminate war, but it made it expensive. Fiat money made it cheap.",
          },
          {
            title: 'Wealth inequality accelerates',
            body: 'When money loses value over time, holding cash punishes you. So those with means move their wealth into assets — real estate, stocks, businesses. Asset prices inflate along with the money supply. Those who own assets get richer as prices rise. Those who do not own assets — and rely on wages and savings — fall further behind. This is not a failure of capitalism. It is a predictable consequence of the money itself.',
          },
          {
            title: 'Product quality degrades',
            body: 'When consumers are slowly being squeezed by inflation, producers face pressure to cut costs without cutting prices visibly. The result is shrinkflation — smaller packages, cheaper materials, reduced durability. Products are engineered to be replaced, not to last. In a hard money economy, a craftsman who built something durable built his reputation for a generation. In an inflationary economy, planned obsolescence is the rational business strategy.',
          },
          {
            title: 'Debt becomes a way of life',
            body: 'If your savings lose value every year, saving is punished. If borrowed money loses value over time, debt is rewarded — you repay with cheaper dollars than you borrowed. This inverts the natural human incentive to build before you buy. Entire generations have been nudged, by the structure of the money itself, into living on credit rather than accumulating savings. The record levels of consumer, corporate, and government debt in the world today are not a moral failure. They are a rational response to bad money.',
          },
          {
            title: 'The unbanked are left furthest behind',
            body: 'In developing countries, the consequences are not abstract. Families saving in local currency watch their savings evaporate through hyperinflation. Remittances sent from abroad are eaten by fees and exchange rates controlled by intermediaries. People store wealth in cement blocks and car parts because holding cash is irrational. The fiat system does not just disadvantage the poor — in many parts of the world, it actively traps them.',
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'What is striking about this list is that none of it required bad intentions. No single person designed a system to impoverish savers, fund endless wars, and hollow out the middle class. These are emergent consequences of the structure of the monetary system itself. And that structure is insidious precisely because even well-intentioned people operating within it — bankers, politicians, central bank officials — will inevitably behave in ways that perpetuate the distortions. The incentives the system creates are more powerful than the intentions of the individuals inside it. The problem is not greed. The problem is the architecture.',
      },
      {
        type: 'coming-next',
        text: 'If bad money reshapes behavior, incentives, and society — then good money should do the opposite. And history shows it does. What does the world look like when money actually holds its value?',
      },
    ],
  },

  {
    n: 4,
    title: 'Hard money changes everything — including how you think',
    description: 'How the money you use shapes your time horizon, your decisions, and your society',
    blocks: [
      {
        type: 'paragraph',
        text: 'Here is a question worth sitting with: why do we build things that last? Cathedrals took generations to complete. The builders who laid the foundation knew they would never see the finished spire. Medieval craftsmen carved intricate details into stonework hundreds of feet above ground — details no human eye would ever clearly see. They built anyway, and they built to last centuries.',
      },
      {
        type: 'paragraph',
        text: 'That was not just piety. It was a reflection of how they related to time — and how their money worked. When money holds its value, the future feels real and worth investing in. When money loses value, the future feels discounted. Why build for a hundred years when you cannot reliably plan for ten?',
      },
      {
        type: 'paragraph',
        text: 'Economists call this time preference — the degree to which people value the present over the future. Everyone has some preference for the present; that is human nature. But the structure of money shapes how strong that preference is, collectively, across an entire society.',
      },
      {
        type: 'pullquote',
        text: 'Hard money lowers time preference. It makes the future feel closer, more valuable, more worth building toward. Soft money does the opposite — it shortens the horizon and nudges everyone to borrow from the future to consume now.',
      },
      {
        type: 'paragraph',
        text: 'This is not abstract. You can see it in the choices people make, the institutions they build, and the debts they accumulate — or do not.',
      },
      {
        type: 'comparison-table',
        leftTitle: 'Soft money world',
        rightTitle: 'Hard money world',
        leftItems: [
          'Saving is irrational — your money loses value sitting still.',
          'Debt is rational — you repay with cheaper money than you borrowed.',
          'Build to be replaced — planned obsolescence maximizes short-term revenue.',
          "Governments borrow indefinitely — the cost is socialized through inflation, quietly spread across every citizen's savings and wages without a vote or a bill.",
          'Art and culture optimize for the immediate and disposable.',
        ],
        rightItems: [
          'Saving is rewarded — your money holds or gains purchasing power over time.',
          'Debt is a serious commitment — the money you owe will cost what it costs.',
          'Build to last — reputation compounds over generations.',
          'Governments must balance — there is no free money to conjure, and the cost of spending is visible and immediate.',
          'Art and culture invest in the enduring — things meant to outlast their makers.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Look at the periods of greatest human flourishing — the Renaissance, the Industrial Revolution, the long 19th century of relative peace and extraordinary innovation — and you will find hard money at the foundation. The classical gold standard era from roughly 1870 to 1914 produced more sustained economic growth, more technological invention, and more broadly shared prosperity than any comparable period before or since.',
      },
      {
        type: 'paragraph',
        text: 'That is not a coincidence. When prices are stable, it becomes possible to plan — really plan — years and decades ahead. A stable unit of account is the foundation of long-term thinking: businesses can forecast, families can save toward a goal, and entrepreneurs can take risks that only pay off over time. Remove that stability and the horizon collapses. Every decision shortens because the future becomes too uncertain to trust.',
      },
      {
        type: 'pullquote',
        text: 'Sound money does not just change what you can afford. It changes what you think is worth doing.',
      },
      {
        type: 'paragraph',
        text: 'So why did we abandon it? Not because hard money failed. Because it constrained power. The United States was founded on hard money principles, with the dollar tied to gold. But the introduction of central banking — the Federal Reserve was established in 1913 — created a trusted third party empowered to manage the money supply. That trust was gradually abused. Through two world wars, the Great Depression, and decades of expanding government programs, the gold constraint was loosened piece by piece. On August 15, 1971, President Nixon removed the last link entirely. From that moment, there was no limit on how much money the government could create.',
      },
      {
        type: 'paragraph',
        text: 'The consequences for government debt were immediate and dramatic. US national debt stood at roughly $400 billion in 1971. It now exceeds $34 trillion — an 85-fold increase in five decades. This is not a coincidence. Leaving the gold standard unleashed the government\'s ability to spend without the discipline of having to tax or borrow from real savings. The debt soared because the constraint was gone. The discipline that made hard money good for citizens made it inconvenient for governments — and so they abandoned it.',
      },
      {
        type: 'paragraph',
        text: 'The question that follows is an obvious one: if gold was the best hard money humanity ever found — and its only flaw was that it could not be transported and verified without trusting a third party — what would happen if that flaw could be fixed?',
      },
      {
        type: 'coming-next',
        text: 'For the first time in history, that flaw has been fixed. Not by a government, not by a bank — by mathematics. What is Bitcoin, and why does it change everything gold could not?',
      },
    ],
  },

  {
    n: 5,
    title: 'Bitcoin — the answer to the question gold could not solve',
    description: "Why the fatal flaw of every previous hard money system has finally been fixed",
    blocks: [
      {
        type: 'paragraph',
        text: 'We have been building toward a specific question. If hard money produces better outcomes — for individuals, for societies, for the long arc of human civilization — and if gold was the best hard money ever found, then why can we not just go back to gold?',
      },
      {
        type: 'paragraph',
        text: "The answer is that gold's fatal flaw was never fixed. Moving gold requires physical trust — vaults, custodians, certificates, and eventually central banks. Every time gold has been used as the foundation of a monetary system, that physical limitation created a pressure point. And every time, that pressure point was eventually exploited — quietly, incrementally, without most people realizing it was happening. Governments, banks, and institutions entrusted to issue certificates equal to their gold holdings found ways to issue more claims on gold than gold actually existed. Each step seemed small and justified at the time. The full picture only became visible in hindsight. The constraints were loosened, then removed.",
      },
      {
        type: 'paragraph',
        text: 'To return to a gold standard would be to repeat the same cycle. The flaw is structural, not political. No amount of good intentions fixes the fact that gold is heavy, hard to verify, and impossible to move across the world instantly without trusting someone.',
      },
      {
        type: 'pullquote',
        text: "What the world needed was something with all of gold's monetary properties — but that could be sent anywhere, verified by anyone, and controlled by no one. For most of history, that was simply impossible. Then, in 2009, it was not.",
      },
      {
        type: 'paragraph',
        text: 'Bitcoin was introduced in 2009 by a person or group using the name Satoshi Nakamoto. The original paper described it as a peer-to-peer electronic cash system — a way to send value directly between two people anywhere in the world, without any trusted third party in the middle. Not a bank. Not an exchange. Not a payment processor. Not a government. Two people, anywhere on earth, transacting directly.',
      },
      {
        type: 'paragraph',
        text: 'But Bitcoin is more than a payment system. It is the first monetary asset in history that is simultaneously scarce, digital, portable, verifiable, and controlled by no single authority. It is not issued by any government. No central bank sets its supply. No institution can inflate it. Its rules are enforced by mathematics and a globally distributed network of computers — not by trust in any person or organization.',
      },
      {
        type: 'paragraph',
        text: 'Let us run Bitcoin against the properties of good money we established in Act 2 — and compare it directly to gold.',
      },
      {
        type: 'comparison-matrix',
        headers: ['Property', 'Gold', 'Bitcoin'],
        rows: [
          {
            prop: 'Scarcity',
            left: 'Finite in nature but unknown total supply. New gold is mined continuously.',
            right: 'Hard capped at 21 million. The last bitcoin will be mined around 2140. No one can change this.',
          },
          {
            prop: 'Portability',
            left: 'Heavy and slow. Moving large amounts requires physical infrastructure and trusted intermediaries.',
            right: 'Sent anywhere in the world in minutes. A billion dollars moves as easily as a dollar.',
          },
          {
            prop: 'Verifiability',
            left: 'Requires physical testing. Counterfeiting is possible. Certificates require trust.',
            right: 'Every transaction verified instantly by the entire network. Counterfeiting is mathematically impossible.',
          },
          {
            prop: 'Decentralization',
            left: 'Storage concentrates in vaults. Custodians become points of control and failure.',
            right: 'Secured by thousands of independent nodes worldwide. No single point of control exists.',
          },
          {
            prop: 'Durability',
            left: 'Does not corrode. Physically durable over millennia.',
            right: 'Exists as information secured by cryptography. Indestructible as long as the network exists.',
          },
          {
            prop: 'Divisibility',
            left: 'Divisible but requires physical manipulation. Small transactions are impractical.',
            right: 'Divisible to 8 decimal places. The smallest unit — one satoshi — enables any transaction size.',
          },
        ],
      },
      {
        type: 'paragraph',
        text: "Bitcoin does not just match gold on the properties that matter. It solves the one property gold never could. And in doing so, it removes the pressure point that every previous hard money system eventually collapsed through. This is why serious economists, investors, and technologists who study monetary history arrive at Bitcoin not through hype but through logic. It is the natural conclusion of asking: what would perfect money look like — and can it exist?",
      },
      {
        type: 'coming-next',
        text: 'Understanding Bitcoin is the first step. But understanding alone does not change anything. What does actually adopting a bitcoin standard look like — what are the real objections, and where do you go from here?',
      },
    ],
  },

  {
    n: 6,
    title: 'What you now understand — and what comes next',
    description: 'Connecting the dots — and where to go from here',
    blocks: [
      {
        type: 'paragraph',
        text: 'Most people who encounter Bitcoin for the first time see a price chart. They wonder whether to buy, whether it is too late, whether it is a bubble or a scam. They engage with it as a financial instrument — something to trade, speculate on, or avoid.',
      },
      {
        type: 'paragraph',
        text: 'That framing misses almost everything that matters.',
      },
      {
        type: 'paragraph',
        text: "What you have just worked through is something different. You started with trade — the most fundamental human behavior. You followed that thread through specialization, civilization, and the emergence of money. You learned what makes money good, traced the long dominance of gold, and understood exactly why gold's one structural flaw was enough to unravel the entire system. You saw what unlimited money creation does — not just to prices, but to wars, inequality, incentives, and the texture of daily life. And you arrived at Bitcoin not through hype, but through logic.",
      },
      {
        type: 'pullquote',
        text: 'The most important thing to understand is not Bitcoin. It is the economic foundation — what easy money costs, what hard money restores, and why the money we use shapes the world we live in. Bitcoin is the solution that follows from that understanding.',
      },
      {
        type: 'paragraph',
        text: 'That understanding changes how you see things. Not just your savings or your investments — but the news, the political arguments, the sense that something is wrong that many people feel but struggle to name. When you know what money is and how it works, a lot of things that seemed random start to look structural.',
      },
      {
        type: 'insight-blocks',
        items: [
          {
            title: 'Why housing feels permanently out of reach',
            body: "Housing is not more expensive because it became more valuable. It is more expensive because our money became less valuable — and because the wealthy, understanding this, use real estate as a store of value to protect their wealth from inflation. Every dollar printed pushes asset prices higher. The result is that housing — a basic human need — has been transformed into a monetary instrument, bid up not by people seeking shelter but by people seeking safety from a failing currency. The family priced out of their neighborhood is not a victim of a housing shortage. They are a victim of monetary policy.",
          },
          {
            title: 'Why wages never seem to catch up',
            body: 'We introduced the Cantillon effect earlier — the structural reality that newly created money flows to those closest to its source first, before prices have risen. Wage earners sit at the furthest end of that chain. By the time new money reaches ordinary salaries, it has already driven up the cost of goods, housing, and services. Workers experience the effect not as rising wages but as rising prices. The gap between what they earn and what life costs widens — not because they work less hard, but because the monetary system redistributes value away from labor and toward assets, systematically and invisibly.',
          },
          {
            title: 'Why debt feels inescapable',
            body: 'This is not an accident. The modern fiat monetary system cannot function without debt — it requires it structurally. Money itself is created when banks issue loans. Without new debt, the money supply contracts. The entire architecture depends on continuous borrowing — by consumers, corporations, and governments — to sustain itself. When saving is punished by inflation and borrowing is subsidized by artificially low interest rates, debt becomes the rational path. Student loans, mortgages, car payments, credit cards — these are not personal failures. They are the natural behavior of people navigating a system that was designed, structurally, to require their debt to keep functioning.',
          },
          {
            title: 'Why everything feels disposable — and who is really to blame',
            body: 'Consumerism, planned obsolescence, degrading product quality — these are often blamed on corporate greed or cheap foreign manufacturing. It is a satisfying explanation, but it is wrong. Corporations do not make disposable products because they are greedy. Manufacturers abroad do not make inferior goods because they want to. They respond to incentives — and the incentives are set by the monetary system. When inflation continuously erodes purchasing power, consumers buy on price. When consumers buy on price, producers cut costs. When producers cut costs, quality falls. When quality falls, products are replaced sooner. The cycle feeds itself. Greed does not explain why this pattern appears across every industry, every country, every decade since the gold standard ended. The monetary system does.',
          },
        ],
      },
      {
        type: 'paragraph',
        text: "Adopting a bitcoin standard — personally, and eventually as a community — is not primarily a financial decision. It is a decision about what kind of future you want to participate in building. It means choosing to save in something that cannot be inflated away. It means opting out of a system that socializes costs onto those least able to bear them. And it means joining a global network of people who have arrived at the same conclusion through the same logic.",
      },
      {
        type: 'paragraph',
        text: 'That transition looks different for different people and different communities. There is no single path. What matters is the first step — which is the one you have already taken.',
      },
      {
        type: 'paragraph',
        text: 'By this point most people have questions. Some are practical, some are skeptical, some go to the heart of whether any of this is realistic. Here are the most common — answered as honestly as we can.',
      },
      {
        type: 'faq-blocks',
        items: [
          {
            category: 'Technical skepticism',
            question: 'Is Bitcoin just used by speculators?',
            answer: "Bitcoin's price volatility is real and reflects its early stage of adoption — just as any emerging asset class is volatile before it matures. But volatility and utility are separate questions. Gold was also volatile in its early monetary history. What matters is whether the underlying monetary properties hold. They do, and have for fifteen years of continuous operation.",
          },
          {
            category: 'Technical skepticism',
            question: 'What about other cryptocurrencies?',
            answer: 'There are thousands of cryptocurrencies. Most are speculative projects with no fixed supply, central teams that can alter their rules, and no meaningful monetary properties. Bitcoin is categorically different — it is the only major digital asset with a provably fixed supply, no controlling authority, and fifteen years of unbroken operation. The distinction matters enormously.',
          },
          {
            category: 'Technical skepticism',
            question: "What about Bitcoin's energy use?",
            answer: "Bitcoin mining uses significant energy — that is true. But energy use alone is not a measure of waste. The question is whether the value produced justifies the energy consumed. The global banking system, gold mining, and armored transportation also consume enormous energy. Bitcoin replaces much of that infrastructure with mathematics. Whether the trade is worthwhile is a legitimate debate. The energy argument is not the slam dunk its critics believe it to be.",
          },
          {
            category: 'Political and regulatory concern',
            question: "Can't governments just ban it?",
            answer: "Governments can and do restrict Bitcoin's use within their borders. But Bitcoin operates on a global, distributed network that no single government controls. Every country that has attempted an outright ban has found it extremely difficult to enforce — the network routes around restrictions. It has never been shut down in fifteen years of operation.",
          },
          {
            category: 'Political and regulatory concern',
            question: "Won't governments just create their own digital currency?",
            answer: "Central bank digital currencies (CBDCs) are being developed by many governments. But a CBDC is the opposite of Bitcoin — it is programmable, controllable, and issued without limit by the same institutions that debased the money we already have. A government-issued digital currency does not solve the scarcity problem. It deepens it.",
          },
          {
            category: 'Philosophical disagreement',
            question: "Isn't it too late to get involved?",
            answer: "Bitcoin's total adoption relative to the global population remains in the low single digits. The transition from a fiat monetary system to a sound money standard — if it happens — is measured in decades, not years. The question of timing is less important than the question of understanding. The most valuable thing is not buying bitcoin — it is understanding why it matters.",
          },
          {
            category: 'Philosophical disagreement',
            question: 'What if the thesis is wrong?',
            answer: "It is worth sitting with this question honestly. The case for Bitcoin rests on the case for sound money — and the case for sound money rests on the documented history of what monetary debasement does to societies. You can disagree with the conclusion while accepting the historical record. What is hard to argue with is the data: debt has soared since 1971, purchasing power has eroded, and the wealth gap has widened. The explanation this series offers is one framework for making sense of that data. We think it is the right one. But forming your own view — informed by the evidence — is the goal.",
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'For those who want to go deeper, the literature on sound money and Bitcoin is substantial. These are the essential starting points.',
      },
      {
        type: 'book-cards',
        items: [
          {
            title: 'The Bitcoin Standard',
            author: 'Saifedean Ammous',
            description: 'The definitive economic case for Bitcoin as sound money. Covers monetary history, the properties of good money, and why Bitcoin is the natural successor to gold. Start here.',
            tag: 'Bitcoin',
          },
          {
            title: 'The Fiat Standard',
            author: 'Saifedean Ammous',
            description: 'A deep examination of how the fiat monetary system actually works — its mechanics, its consequences, and why it is structurally unsustainable.',
            tag: 'Monetary',
          },
          {
            title: 'What Has Government Done to Our Money?',
            author: 'Murray Rothbard',
            description: 'A short, readable classic on monetary theory and the history of government intervention in money. One of the clearest explanations of how central banking distorts economies.',
            tag: 'Foundation',
          },
          {
            title: 'Price of Tomorrow',
            author: 'Jeff Booth',
            description: 'Explores the collision between deflationary technology and inflationary monetary policy — and why the current system is fighting a losing battle against the natural direction of progress.',
            tag: 'Monetary',
          },
          {
            title: 'Broken Money',
            author: 'Lyn Alden',
            description: 'A comprehensive, data-rich examination of the global monetary system — how it was built, how it is breaking down, and what comes next. Accessible to non-economists.',
            tag: 'Monetary',
          },
          {
            title: 'A Little History of Money',
            author: 'Lawrence Lepard',
            description: 'A concise and clear narrative of monetary history — how money evolved, how it was corrupted, and the investment case for hard money in the current environment.',
            tag: 'Foundation',
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'Works in progress — from this community',
      },
      {
        type: 'book-cards',
        items: [
          {
            title: 'Abundance Architecture',
            author: 'Coming soon',
            description: 'A framework for building personal and community prosperity on a sound money foundation. Website in development.',
            tag: 'Own work',
          },
          {
            title: 'Health Unveiled',
            author: 'Coming soon',
            description: 'Exploring the intersection of monetary policy, incentive structures, and public health outcomes. Website in development.',
            tag: 'Own work',
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'The monetary system is not a law of nature. It is a human invention — and human inventions can be changed. Understanding is where that change begins.',
      },
      {
        type: 'paragraph',
        text: 'Understanding the monetary system changes what you see. It also changes what you can build.',
      },
      {
        type: 'paragraph',
        text: 'The extraction mechanism described across these six acts operates at scale because most people never learn to name it. Communities that do — that understand where the value goes and why — can begin making decisions that don\'t feed that mechanism. Not through protest. Not through political action. Through the deliberate construction of economic relationships built on a different foundation.',
      },
      {
        type: 'paragraph',
        text: 'This is not a distant possibility. It is already happening, in forms that range from individual savings decisions to community exchange networks to nation-state monetary policy. The common thread is not ideology. It is understanding — and the choices that follow naturally from it.',
      },
      {
        type: 'paragraph',
        text: 'Decentralization is not a political position. It is what emerges when enough people in a community understand the extraction mechanism and choose to build their exchange on a foundation that doesn\'t contain it.',
      },
      {
        type: 'three-level',
        title: 'Three levels of response',
        levels: [
          {
            label: 'Individual',
            body: 'Hard money savings. Honest measurement of your own financial position against a benchmark that doesn\'t shrink. The dashboard is the starting point.',
            link: { text: 'Go to Dashboard →', href: '/dashboard', external: false },
          },
          {
            label: 'Community',
            body: 'Circular economies — local exchange networks built on hard money principles. Communities where work and savings hold their value. Where the honest person is not systematically disadvantaged. Architecture of Abundance explores this in depth.',
            link: { text: 'abundancearchitecture.world ↗', href: 'https://abundancearchitecture.world', external: true },
          },
          {
            label: 'Systemic',
            body: 'Bitcoin as a monetary transition — not a trading opportunity but a fundamental change in what money is and who controls it. The adoption index tracks how far along that transition the world actually is.',
            link: { text: 'Bitcoin Adoption Index →', href: '/lens/adoption', external: false },
          },
        ],
      },
      {
        type: 'cta-panels',
        left: {
          title: 'Watch the system live',
          label: 'Explore the dashboard →',
          to: '/dashboard',
          body: 'The freeMarketWatch dashboard tracks currencies, purchasing power, and monetary data in real time — the system described in these six acts, measured and visible as it unfolds.',
        },
        right: {
          title: 'Go deeper',
          label: 'abundancearchitecture.world ↗',
          href: 'https://abundancearchitecture.world',
          external: true,
          body: 'The community question — what to build once you understand the problem — is explored at Architecture of Abundance.',
        },
      },
    ],
  },
];
