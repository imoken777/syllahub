import { Button } from '@/components/ui/Button';

export const Header = ({ title, description }: { title: string; description: string }) => (
  <header className="container mx-auto border-b-2 p-4">
    <div className="flex h-16 items-center justify-between">
      <div>
        <h1 className="text-xl font-medium">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center">
        <Button variant="link" asChild>
          <a href="https://g-sys.toyo.ac.jp/syllabus/" target="_blank" rel="noopener noreferrer">
            公式シラバスはこちら
          </a>
        </Button>
      </div>
    </div>
  </header>
);
