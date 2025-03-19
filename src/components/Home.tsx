// library-inventory-system\src\components\Home.tsx




'use client'
import { JSX } from "react";
import { FaBookOpen, FaClock, FaGlobe, FaUserShield, FaSearch, FaMobileAlt, FaBell, FaDatabase } from "react-icons/fa";
import Link from 'next/link';
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const joinBtn = () =>{
    router.push("/register")
  }

  return (
    <div className="flex flex-col flex-grow">
      {/* Hero Section */}
      <div className="relative bg-blue-600 h-[30vh] text-white text-center flex flex-col justify-center items-center">
        <div className="absolute inset-0 bg-[url('/library.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold drop-shadow-lg">
            Welcome to <span className="text-yellow-400">BookNest</span>
          </h1>
          <p className="text-lg mt-4 drop-shadow-md">
            Your digital gateway to endless knowledge and literary adventures
          </p>
          <div className="mt-6">
            <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition duration-300 cursor-pointer">
              Explore Library
            </button>
            <button className="ml-4 border-2 border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300 cursor-pointer" onClick={joinBtn}>
              Join Now
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex-grow bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Why Choose <span className="text-blue-600">BookNest</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <FeatureCard 
              title="Vast Collection" 
              description="Access thousands of books across multiple genres and categories." 
              icon={<FaBookOpen className="text-blue-600 text-4xl" />}
            />
            <FeatureCard 
              title="Easy Management" 
              description="Effortlessly track your borrowed books and due dates." 
              icon={<FaClock className="text-blue-600 text-4xl" />}
            />
            <FeatureCard 
              title="Digital Catalog" 
              description="Browse our entire collection from the comfort of your home." 
              icon={<FaGlobe className="text-blue-600 text-4xl" />}
            />
            <FeatureCard 
              title="Secure Access" 
              description="Advanced authentication ensures a safe and private experience." 
              icon={<FaUserShield className="text-blue-600 text-4xl" />}
            />
            <FeatureCard 
              title="Smart Search" 
              description="Quickly find books with powerful search and filtering options." 
              icon={<FaSearch className="text-blue-600 text-4xl" />}
            />
            <FeatureCard 
              title="Mobile Friendly" 
              description="Access the library on the go with our mobile-friendly interface." 
              icon={<FaMobileAlt className="text-blue-600 text-4xl" />}
            />
            <FeatureCard 
              title="Instant Notifications" 
              description="Stay updated with reminders for due dates and new arrivals." 
              icon={<FaBell className="text-blue-600 text-4xl" />}
            />
            <FeatureCard 
              title="Cloud Storage" 
              description="Save and sync your reading history across multiple devices." 
              icon={<FaDatabase className="text-blue-600 text-4xl" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: JSX.Element }) => {
  return (
    <div className="p-5 bg-white rounded-lg shadow-md flex items-start space-x-4 transform hover:scale-105 transition duration-300">
      <div>{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Home;
