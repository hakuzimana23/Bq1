import { useState } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useBalance,
} from 'wagmi'
import { injected } from 'wagmi/connectors'
import { parseEther, formatEther } from 'viem'

// ⚠️ Replace with your deployed proxy address
const VAULT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

const VAULT_ABI = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'getBalance',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'calculateReward',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getTotalDeposited',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
]

function App() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [depositAmount, setDepositAmount] = useState('0.1')
  const [txStatus, setTxStatus] = useState('')

  // Read user balance in vault
  const { data: vaultBalance } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'getBalance',
    args: [address],
    enabled: !!address,
  })

  // Read potential rewards
  const { data: reward } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'calculateReward',
    args: [address],
    enabled: !!address,
  })

  // Read total deposited
  const { data: totalDeposited } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'getTotalDeposited',
  })

  // Wallet ETH balance
  const { data: walletBalance } = useBalance({ address })

  // Write contract hooks
  const { writeContract: depositWrite } = useWriteContract()
  const { writeContract: withdrawWrite } = useWriteContract()

  const handleDeposit = async () => {
    try {
      setTxStatus('⏳ Pending...')
      depositWrite(
        {
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: 'deposit',
          value: parseEther(depositAmount),
        },
        {
          onSuccess: () => setTxStatus('✅ Deposit Successful!'),
          onError: (e) => setTxStatus(`❌ Error: ${e.message}`),
        }
      )
    } catch (e) {
      setTxStatus(`❌ Error: ${e.message}`)
    }
  }

  const handleWithdraw = async () => {
    try {
      setTxStatus('⏳ Pending...')
      withdrawWrite(
        {
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: 'withdraw',
        },
        {
          onSuccess: () => setTxStatus('✅ Withdrawal Successful!'),
          onError: (e) => setTxStatus(`❌ Error: ${e.message}`),
        }
      )
    } catch (e) {
      setTxStatus(`❌ Error: ${e.message}`)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>🏦 ETH Deposit Vault</h1>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          style={btnStyle('#4CAF50')}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div style={cardStyle}>
            <h3>👛 Wallet</h3>
            <p><b>Address:</b> {address}</p>
            <p><b>ETH Balance:</b> {walletBalance
              ? formatEther(walletBalance.value) : '0'} ETH</p>
            <button onClick={() => disconnect()} style={btnStyle('#f44336')}>
              Disconnect
            </button>
          </div>

          <div style={cardStyle}>
            <h3>📊 Vault Dashboard</h3>
            <p><b>Your Vault Balance:</b> {vaultBalance
              ? formatEther(vaultBalance) : '0'} ETH</p>
            <p><b>Potential Reward:</b> {reward
              ? formatEther(reward) : '0'} ETH</p>
            <p><b>Total ETH Locked:</b> {totalDeposited
              ? formatEther(totalDeposited) : '0'} ETH</p>
          </div>

          <div style={cardStyle}>
            <h3>💰 Deposit</h3>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              step="0.01"
              style={{ padding: '8px', width: '200px', marginRight: '10px' }}
            />
            <span>ETH</span>
            <br /><br />
            <button onClick={handleDeposit} style={btnStyle('#2196F3')}>
              Deposit ETH
            </button>
          </div>

          <div style={cardStyle}>
            <h3>🏧 Withdraw</h3>
            <button onClick={handleWithdraw} style={btnStyle('#FF9800')}>
              Withdraw All + Rewards
            </button>
          </div>

          {txStatus && (
            <div style={{
              ...cardStyle,
              background: txStatus.includes('✅') ? '#e8f5e9' :
                txStatus.includes('❌') ? '#ffebee' : '#fff3e0'
            }}>
              <b>Transaction Status:</b> {txStatus}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  background: '#f9f9f9',
}

const btnStyle = (color) => ({
  background: color,
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
})

export default App