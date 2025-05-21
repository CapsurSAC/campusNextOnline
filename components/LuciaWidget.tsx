'use client';

export default function LuciaWidget() {
  const handleClick = () => {
    window.open(
      'https://chatgpt.com/g/g-67eaffd5a94c81918945652d44cdec39-chat-lucia',
      '_blank',
      'width=420,height=700,left=1000,top=100,noopener,noreferrer'
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
    >
      💬 Mentor June
    </button>
  );
}
