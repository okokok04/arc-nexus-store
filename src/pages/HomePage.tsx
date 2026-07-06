import { Link } from 'react-router-dom'
import { useWallet } from '@hooks/useWallet'

export default function HomePage() {
  const { isConnected } = useWallet()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Stellar Escrow
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Secure, transparent peer-to-peer transactions on Stellar Soroban
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/create" className="btn btn-primary text-lg px-8 py-3">
              🚀 Create Escrow
            </Link>
            {isConnected && (
              <Link to="/history" className="btn btn-secondary text-lg px-8 py-3">
                📊 Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white bg-opacity-50 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Stellar Escrow?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔒"
              title="Secure"
              description="Smart contracts ensure funds are protected until both parties agree"
            />
            <FeatureCard
              icon="⚡"
              title="Fast"
              description="Transaction confirmation in seconds, not hours or days"
            />
            <FeatureCard
              icon="💰"
              title="Low Cost"
              description="Minimal fees with transparent pricing, no hidden charges"
            />
            <FeatureCard
              icon="🌍"
              title="Global"
              description="Send and receive from anywhere in the world using Stellar"
            />
            <FeatureCard
              icon="🛡️"
              title="Dispute Resolution"
              description="Built-in dispute mechanism for buyer and seller protection"
            />
            <FeatureCard
              icon="📱"
              title="Easy to Use"
              description="Simple interface with Freighter wallet integration"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <Step
              number="1"
              title="Create Escrow"
              description="Buyer initiates escrow with seller's address and payment amount"
            />
            <Step
              number="2"
              title="Deposit Funds"
              description="Buyer deposits funds into secure smart contract escrow"
            />
            <Step
              number="3"
              title="Delivery Confirmation"
              description="Buyer confirms receipt of goods/services from seller"
            />
            <Step
              number="4"
              title="Payment Release"
              description="Smart contract automatically releases payment to seller (minus 1% fee)"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isConnected && (
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Connect your Freighter wallet to create your first escrow transaction
            </p>
            <Link to="/" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Connect Wallet
            </Link>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white bg-opacity-50 backdrop-blur">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem
              question="What is an escrow?"
              answer="An escrow is a neutral third party (in this case, a smart contract) that holds payment until the goods or services are delivered satisfactorily."
            />
            <FAQItem
              question="How much does it cost?"
              answer="Stellar Escrow charges a 1% fee on the transaction amount. This fee is only charged when the payment is successfully released."
            />
            <FAQItem
              question="What if there's a dispute?"
              answer="Both buyer and seller can file a dispute. Our team reviews disputes and makes a fair resolution, refunding the buyer or releasing to the seller."
            />
            <FAQItem
              question="How long does it take?"
              answer="Most transactions confirm within 5-10 seconds on the Stellar network. Instant transfers once confirmed."
            />
            <FAQItem
              question="Is it safe?"
              answer="Yes! Stellar Escrow is built on Stellar Soroban smart contracts, which have been audited and are secured by the Stellar network."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="card p-6 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg">
          {number}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="card p-4 cursor-pointer">
      <summary className="font-bold text-lg">{question}</summary>
      <p className="text-gray-600 mt-3">{answer}</p>
    </details>
  )
}
