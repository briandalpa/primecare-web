import { Link } from 'react-router-dom';
import primeCareLogo from '@/assets/prime-care.png';

export function AuthLogo() {
  return (
    <Link
      to="/"
      className="inline-flex items-center justify-center gap-2 mb-1"
    >
      <img
        src={primeCareLogo}
        alt="PrimeCare"
        className="h-7 w-7 object-contain -mx-1"
      />
      <span className="text-xl font-bold text-primary font-heading">
        PrimeCare
      </span>
    </Link>
  );
}
