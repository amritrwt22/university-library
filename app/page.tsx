import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@radix-ui/react-avatar';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the University Library</h1>
            <p>Your one-stop destination for all academic resources.</p>
            <nav>
                <ul>
                    <li><a href="/books">Books</a></li>
                    <li><a href="/journals">Journals</a></li>
                    <li><a href="/about">About Us</a></li>
                </ul>
            </nav>
            <Button>click me</Button>
        </div>
    );
};

export default HomePage;