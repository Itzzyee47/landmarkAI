
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';

const getUserInitials = (nameOrEmail: string | null | undefined): string => {
  if (!nameOrEmail) return 'U';
  const parts = nameOrEmail.split(/[\s@.]+/).filter(Boolean);
  return parts.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('');
};

const UserAvatar = () => {
  const [userInfo, setUserInfo] = useState<{
    email: string;
    photoURL: string | null;
    displayName: string | null;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserInfo({
          email: user.email || '',
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  if (!userInfo) return null;

  return (
    <div
      className="w-9 h-9 rounded-full cursor-pointer"
      title={userInfo.email}
      onClick={() => navigate('/manage-profile')}
    >
      {userInfo.photoURL ? (
        <img
          src={userInfo.photoURL}
          alt="User Avatar"
          className="w-full h-full rounded-full object-cover border border-purple-200 shadow-sm"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
          {getUserInitials(userInfo.displayName || userInfo.email)}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
