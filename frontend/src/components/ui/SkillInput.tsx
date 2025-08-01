import { useState, KeyboardEvent } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SkillInputProps {
  skills: string[];
  onAdd: (skill: string) => void;
  onDelete: (index: number) => void;
  placeholder?: string;
}

export default function SkillInput({ skills, onAdd, onDelete, placeholder = 'Add a skill' }: SkillInputProps) {
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (newSkill.trim()) {
      onAdd(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm font-medium"
          >
            {skill}
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="ml-2 text-indigo-500 hover:text-indigo-700"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 