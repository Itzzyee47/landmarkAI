import { useEffect, useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '@/lib/firebase';
import { User, Mail, Star, MessageSquare, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const getUserInitials = (nameOrEmail: string | null | undefined): string => {
  if (!nameOrEmail) return 'U';
  const parts = nameOrEmail.split(/[\s@.]+/).filter(Boolean);
  return parts.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('');
};

const ManageProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    bio: '',
    university: 'Landmark University',
    photoURL: ''
  });

  const [review, setReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setProfile(prev => ({
          ...prev,
          fullName: user.displayName || 'User',
          email: user.email || '',
          photoURL: user.photoURL || ''
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      // Update Firebase Auth
      await updateProfile(auth.currentUser, { photoURL });

      // Update Firestore
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, { photoURL }, { merge: true });

      setProfile(prev => ({ ...prev, photoURL }));
      alert('Profile picture updated!');
    } catch (err) {
      console.error('Photo upload failed:', err);
      alert('Failed to upload photo');
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview({
      ...review,
      comment: e.target.value
    });
  };

  const handleRatingChange = (rating: number) => {
    setReview({
      ...review,
      rating
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profile);
    // Add logic here to update additional profile data if needed
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const feedbackDoc = {
        feedback: review.comment.trim(),
        rating: review.rating || 0,
        user: auth.currentUser?.email || 'anonymous',
        time: new Date().toISOString()
      };
  
      await setDoc(doc(db, 'feedbacks', crypto.randomUUID()), feedbackDoc);
  
      alert('Review submitted successfully!');
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review');
    }
  };  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/chat">
            <Button variant="outline" size="sm" className="border-purple-200">
              <ArrowLeft size={16} className="mr-2" />
              Back to Chat
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage Profile</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-600" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  {profile.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt="User"
                      className="w-24 h-24 rounded-full border shadow-sm object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {getUserInitials(profile.fullName || profile.email)}
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    id="photoInput"
                    accept="image/*"
                    hidden
                    onChange={handlePhotoUpload}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-200"
                    type="button"
                    onClick={() => document.getElementById('photoInput')?.click()}
                  >
                    Change Photo
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Full Name
                    </label>
                    <Input
                      disabled
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        disabled
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="pl-10 border-purple-200 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      University
                    </label>
                    <Input
                      disabled
                      name="university"
                      value={profile.university}
                      onChange={handleProfileChange}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Bio (Optional)
                    </label>
                    <Textarea
                      name="bio"
                      disabled
                      value={profile.bio}
                      onChange={handleProfileChange}
                      placeholder="Tell us a bit about yourself..."
                      className="border-purple-200 focus:border-purple-500 resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Review Section */}
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span>Leave a Review</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    How would you rate your experience with Zylla?
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className={`w-10 h-10 rounded-full transition-colors ${
                          star <= review.rating
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star 
                          size={24} 
                          className={star <= review.rating ? 'fill-current' : ''} 
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {review.rating} out of 5 stars
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Your Review
                  </label>
                  <Textarea
                    value={review.comment}
                    onChange={handleReviewChange}
                    placeholder="Share your experience with Zylla. What did you like? What could be improved?"
                    className="border-purple-200 focus:border-purple-500 resize-none"
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  disabled={!review.comment.trim()}
                >
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;
