import React, { useState, useEffect } from 'react';

const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            addNotification("Reminder: Stay tuned for upcoming events!");
        }, 20000); 


        return () => clearInterval(intervalId);
    }, []);


    const addNotification = (message) => {
        setNotifications((prevNotifications) => [...prevNotifications, message]);


        setTimeout(() => {
            setNotifications((prevNotifications) => prevNotifications.slice(1));
        }, 5000);
    };

    return (
        <div className="notification-container" style={styles.notificationContainer}>
            {notifications.map((notification, index) => (
                <div key={index} className="notification" style={styles.notification}>
                    {notification}
                </div>
            ))}
        </div>
    );
};

const styles = {
    notificationContainer: {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000,
    },
    notification: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
};

export default NotificationSystem;

