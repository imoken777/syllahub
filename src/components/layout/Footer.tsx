import { Github } from 'lucide-react';

export const Footer = ({ title, description }: { title: string; description: string }) => (
  <footer className="container mx-auto mt-4 border-t-2 p-4">
    <div className="flex flex-col items-center justify-between md:flex-row">
      <div className="mb-4 text-center md:mb-0 md:text-left">
        <p className="text-sm text-gray-600">
          {title} - {description}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          このサイトは非公式であり、東洋大学およびINIADとは無関係です。
        </p>
      </div>
      <div className="flex space-x-4">
        <a
          href="https://github.com/imoken777/sillahub"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
        >
          <Github className="size-6" />
          <span className="sr-only">GitHub</span>
        </a>
      </div>
    </div>
  </footer>
);
