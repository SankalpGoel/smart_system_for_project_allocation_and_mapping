import React from 'react';
import clsx from 'clsx';
import styles from './Table.module.css';

export const Table = ({ children, className }) => (
  <div className={clsx(styles.tableContainer, className)}>
    <table className={styles.table}>{children}</table>
  </div>
);

export const THead = ({ children }) => <thead className={styles.thead}>{children}</thead>;
export const TBody = ({ children }) => <tbody className={styles.tbody}>{children}</tbody>;
export const TR = ({ children, className }) => <tr className={clsx(styles.tr, className)}>{children}</tr>;
export const TH = ({ children, className }) => <th className={clsx(styles.th, className)}>{children}</th>;
export const TD = ({ children, className }) => <td className={clsx(styles.td, className)}>{children}</td>;
