import React, { useState } from 'react';
import UserHeader from './UserHeader';
import Footer from './Footer';

const faqs = [
  {
    section: 'Payment and Returns',
    items: [
      {
        question: 'What is Lorem Ipsum?',
        answer:
          'Nullam sed neque luctus, maximus diam sed, facilisis orci. Nunc ultricies neque a aliquam sollicitudin...',
      },
      {
        question: 'Why do we use it?',
        answer:
          'Cras non gravida urna. Ut venenatis nulla in tellus lobortis, vel mollis lectus condimentum...',
      },
      {
        question: 'How to use this template?',
        answer:
          'Duis nec nisi id ligula dapibus maximus nec eu dui. Proin ornare, ipsum vitae tincidunt rutrum...',
      },
    ],
  },
  {
    section: 'Other Resources',
    items: [
      {
        question: 'Integer et erat quis ante tristique lobortis at vel lorem.',
        answer:
          'Proin varius magna rhoncus quam egestas, id faucibus eros viverra. Suspendisse id ipsum...',
      },
      {
        question: 'Where does it come from?',
        answer:
          'Aliquam erat volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus...',
      },
      {
        question: 'Why do we use it?',
        answer:
          'It is a long established fact that a reader will be distracted by the readable content...',
      },
    ],
  },
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  let count = 0;

  return (
    <>
      <UserHeader />
      <div className="py-12 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">FAQs</h1>
        </div>

        {faqs.map((section, sectionIdx) => (
          <div
            key={sectionIdx}
            className="mb-10">
            <h2 className="text-2xl font-semibold mb-6 text-[#FF708E]">
              {section.section}
            </h2>

            {section.items.map((item, itemIdx) => {
              const index = count++;
              const isActive = activeIndex === index;
              return (
                <div
                  key={index}
                  className="mb-4 border-b border-gray-300 pb-2">
                  <button
                    onClick={() => toggle(index)}
                    className="w-full text-left text-lg font-medium hover:text-[#FF708E] focus:outline-none">
                    {item.question}
                  </button>
                  {isActive && (
                    <div className="mt-2 text-gray-600 text-sm animate-fade-in">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default FAQPage;
