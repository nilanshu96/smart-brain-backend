BEGIN TRANSACTION;

--email: jenna@gmail.com password: marbles
INSERT INTO users(name, age, email, entries, joined) VALUES ('jenna', 25, 'jenna@gmail.com', 7, '2019-01-01');
INSERT INTO login(hash, email) VALUES ('$2b$10$tlfBR1nOuCejuzaGLG7dweMg1GZ7NOu9hCCaKqMWvPukz/BsJitIe','jenna@gmail.com');

COMMIT;