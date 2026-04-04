import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const OAuthCallback = () => {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const { oauthCallback } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      setError(t('auth.oauthError', { provider }));
      return;
    }

    oauthCallback(provider, code, state).then((result) => {
      if (result.success) {
        navigate('/trips', { replace: true });
      } else {
        setError(result.error || t('auth.oauthError', { provider }));
      }
    });
  }, [provider, searchParams, oauthCallback, navigate, t]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            {t('auth.login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
