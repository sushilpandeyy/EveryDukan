import { useState } from 'react';

const AccountDeletionRequestPage = () => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('https://qzzv2wgt82.execute-api.ap-south-1.amazonaws.com/v1/app/doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reason,
          requestDate: new Date().toISOString(),
          requestedBy: 'user',
        }),
      });
      if (response.ok) {
        setMessage('Account deletion request submitted successfully.');
        setEmail('');
        setReason('');
      } else {
        setMessage('Failed to submit the request. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Request Account Deletion</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="user@example.com"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Reason for Deletion</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Provide your reason..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default AccountDeletionRequestPage;
