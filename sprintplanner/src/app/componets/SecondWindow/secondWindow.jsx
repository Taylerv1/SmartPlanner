import React, { useState } from 'react';
import styles from './secondWindow.module.scss';

const SecondWindow = ({ moc, showModal, setShowModal }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createJiraIssues = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/jira', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tasks: moc
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create tasks in JIRA');
            }

            setSuccess(true);
            // Close modal after showing success message
            setTimeout(() => {
                setShowModal(false);
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!showModal) return null;

    return (
        <>
            <div className={styles.modalOverlay} onClick={() => !isLoading && setShowModal(false)} />
            <div className={styles.modal}>
                <h2 className={styles.modalTitle}>Generated Tasks</h2>
                <div className={styles.taskList}>
                    {moc.map((task, index) => (
                        <div key={index} className={styles.taskItem}>
                            <span className={styles.taskNumber}>{index + 1}.</span>
                            <span className={styles.taskText}>{task}</span>
                        </div>
                    ))}
                </div>
                
                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={styles.success}>
                        Tasks successfully created in JIRA!
                    </div>
                )}
                
                <button
                    className={styles.confirmButton}
                    onClick={createJiraIssues}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Tasks...' : 'Confirm and Send'}
                </button>
            </div>
        </>
    );
};

export default SecondWindow;