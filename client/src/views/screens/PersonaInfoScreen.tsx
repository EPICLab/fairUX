// views/screens/PersonaInfoScreen.tsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import navigationController from '../../controllers/navigationController';
import { Link } from 'react-router-dom';

const PersonaInfoScreen: React.FC = () => {
  const handleBack = () => {
    navigationController.goToUpload(); // or wherever you want to navigate back to
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/">
            <button 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-8 h-8" />
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-center flex-1">
            Persona Information
          </h1>
        </div>

        {/* Personas Container */}
        <div className="space-y-12">
          {/* Abi Persona */}
          <div className="bg-white rounded-2xl border-2 border-red-200 p-8 shadow-lg">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              {/* Left - Images and Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  Abi (Abigail/Abishek)<sup className="text-sm">1</sup>
                </h2>
                
                {/* Profile Images */}
                <img
                src='/assets/personas/abi-info.png'
                alt={`Abi avatar`}
                className="w-48 h-48 rounded-full object-cover border-4 border-gray-100 shadow-lg"
                />
              </div>

              {/* Right - Background and Skills */}
              <div className="flex-1">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-red-600 mb-4">Background and Skills</h3>
                  <p className="text-gray-800 leading-relaxed">
                    <span className="text-red-600">The technologies at Abi's new position are new to them. Abi likes Math and working with logic. They considers themselves a numbers person.</span>
                  </p>
                </div>
                
                {/* Work Style Note */}
                <div className="mt-4 text-sm text-gray-600 italic">
                  Abi likes scanning all their emails first to get an overall picture before answering any of them.
                </div>
              </div>
            </div>

            {/* Motivations and Attitudes */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-black mb-4">Motivations and Attitudes</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-black mb-2">• Motivations:</h4>
                  <p className="text-sm">
                    Abi uses technologies <span className="text-red-600">to accomplish their tasks</span>. 
                    They learn new technologies if and when they need to, but prefer to use methods they are 
                    <span className="text-red-600"> already familiar and comfortable with</span>, to keep their 
                    <span className="text-red-600"> focus on the tasks they care about</span>.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">• Computer Self-Efficacy:</h4>
                  <p className="text-sm">
                    Abi has <span className="text-red-600">lower self confidence than their peers about doing unfamiliar</span> 
                    computing tasks. If problems arise with their technology, they often 
                    <span className="text-red-600"> blame themselves for these problems</span>. This affects whether and how 
                    they will persevere with a task if technology problems have arisen.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">• Attitude toward Risk:</h4>
                  <p className="text-sm">
                    Abi's life is a little complicated and they rarely have spare time. So they are 
                    <span className="text-red-600"> risk averse about using unfamiliar technologies that might need them to spend extra time on</span>, 
                    even if the new features might be relevant. They instead performs tasks using familiar features, 
                    because they're more predictable about what they will get from them and how much time they will take.
                  </p>
                </div>
              </div>
            </div>

            {/* How Abi Works */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-black mb-4">How Abi Works with Information and Learns:</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-black mb-2">• Information Processing Style:</h4>
                  <p className="text-sm">
                    Abi tends towards a comprehensive information processing style when they need to gather more information. 
                    So, instead of acting upon the first option that seems promising, they 
                    <span className="text-red-600"> gather information comprehensively to try to form a complete understanding of the problem before trying to solve it</span>. 
                    Thus, their style is "<span className="text-red-600">bursty</span>"; first they read a lot, then they act on it in a batch of activity.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">• Learning: by Process vs. by Tinkering:</h4>
                  <p className="text-sm">
                    When learning new technology, Abi leans toward <span className="text-red-600">process-oriented learning</span>, 
                    e.g., tutorials, step-by-step processes, wizards, online how-to videos, etc. 
                    <span className="text-red-600"> They don't particularly like learning by tinkering with software</span> 
                    (i.e., just trying out new features or commands to see what they do), but when they do tinker, 
                    it has positive effects on their understanding of the software.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 text-xs text-gray-600">
              <sup>1</sup>Abi represents users with motivations/attitudes and information/learning styles similar to hers. 
              For gender distribution data on users similar to and different from Abi, see http://gendermag.org
            </div>
          </div>

          {/* Tim Persona */}
          <div className="bg-white rounded-2xl border-2 border-red-200 p-8 shadow-lg">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              {/* Left - Images and Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  Tim (Timara/Timothy)<sup className="text-sm">1</sup>
                </h2>
                <img
                src='/assets/personas/tim-info.png'
                alt={`Tim avatar`}
                className="w-48 h-48 rounded-full object-cover border-4 border-gray-100 shadow-lg"
                />
              </div>

              {/* Right - Background and Skills */}
              <div className="flex-1">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-red-600 mb-4">Background and Skills</h3>
                  <p className="text-gray-800 leading-relaxed">
                    <span className="text-red-600">The technologies at Tim's new position are new to them. Tim likes Math and working with logic. They consider themselves a numbers person. Tim enjoys learning about and using new technologies.</span>
                  </p>
                </div>
                
                {/* Work Style Note */}
                <div className="mt-4 text-sm text-gray-600 italic">
                  Work starts with emails, which they answer one at a time, as soon as they read them.
                </div>
              </div>
            </div>

            {/* Motivations and Attitudes */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-black mb-4">Motivations and Attitudes</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-black mb-2">• Motivations:</h4>
                  <p className="text-sm">
                    Tim <span className="text-red-600">likes learning all the available functionality on all of their devices</span> 
                    and computer systems they use, even when it may not be necessary to help them achieve their tasks. 
                    They sometimes finds themselves exploring functions of one of their gadgets for so long that they lose sight of what they wanted to do with it to begin with.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">• Computer Self-Efficacy:</h4>
                  <p className="text-sm">
                    Tim have <span className="text-red-600">high confidence in their abilities with</span> technology, 
                    and think they're better than the average person at learning about new features. 
                    <span className="text-red-600"> If they can't fix the problem, they blame it on the software vendor</span>. 
                    It's not their fault if they can't get it to work.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">• Attitude toward Risk:</h4>
                  <p className="text-sm">
                    Tim <span className="text-red-600">doesn't mind taking risks using features of</span> technology that haven't been proven to work. 
                    When they are presented with challenges because they have tried a new way that doesn't work, 
                    it doesn't changes their attitude toward technology.
                  </p>
                </div>
              </div>
            </div>

            {/* How Tim Works */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-black mb-4">How Tim Works with Technology and Learns</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-black mb-2">• Information Processing Style:</h4>
                  <p className="text-sm">
                    Tim leans towards a selective information processing style or "depth first" approach. 
                    That is, they usually <span className="text-red-600">delve into the first promising option</span>, 
                    pursue it, and <span className="text-red-600">if it doesn't work out they back out</span> and gather a bit more information until 
                    they <span className="text-red-600">see another option to try</span>. Thus, their style is very incremental.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">• Learning: by Process vs. by Tinkering:</h4>
                  <p className="text-sm">
                    Whenever Tim uses new technology, they try to construct their own understanding of how the software works internally. 
                    They <span className="text-red-600">like tinkering and exploring the menu items</span> and functions of the software in order to build that understanding. 
                    Sometimes they play with features too much, losing focus on what they set out to do originally, 
                    but this helps them gain better understanding of the software.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 text-xs text-gray-600">
              For gender distribution data on users similar to and different from Tim, see 
              <a href="http://gendermag.org/" className="text-blue-600 underline ml-1">http://gendermag.org/</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaInfoScreen;