'use client';

import { useState } from 'react';
import styles from './styles.module.scss';
import SecondWindow from './componets/SecondWindow/SecondWindow';

export default function Home() {
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const mockTasks = [
    'Set up project architecture and folder structure',
    'Implement user authentication system',
    'Create database schema for sprint management',
    'Design and implement RESTful API endpoints',
    'Add form validation and error handling'
  ];

  const handleGenerateTasks = () => {
    if (description.trim()) {
      setShowModal(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.starBackground}>
        <div className={styles.stars}></div>
        <div className={styles.stars2}></div>
        <div className={styles.stars3}></div>
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Smart Planner</h1>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your sprint description here..."
        />
        <button 
          className={styles.button}
          onClick={handleGenerateTasks}
          disabled={!description.trim()}
        >
          Generate Tasks
        </button>
      </div>

      {showModal && (<SecondWindow moc={mockTasks} setShowModal={setShowModal} showModal={showModal} />)}
    </div>
  );
}
