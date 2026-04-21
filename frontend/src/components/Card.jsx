import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

const Card = ({ children, className, glass = false }) => {
  return (
    <div className={clsx(styles.card, glass && 'glass', className)}>
      {children}
    </div>
  );
};

export default Card;
