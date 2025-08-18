import { Home, Loader2, ExternalLink } from 'lucide-react';
import Button from '../components/Button';

export default function Test() {
  return (
    <>
      {/* With start icon */}
      <Button to='/' iconStart={<Home size={18} />} variant='primary'>
        Home
      </Button>

      {/* With end icon */}
      <Button href='/docs' iconEnd={<ExternalLink size={16} />} variant='outline'>
        Docs
      </Button>

      {/* Loading state */}
      <Button loading variant='primary'>
        Loading...
      </Button>
    </>
  );
}
