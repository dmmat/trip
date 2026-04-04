import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    api.auth.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-blue-600 mb-3">
          TripPlanner
        </h1>
        <Card>
          <CardContent className="p-8 text-center">
            {status === 'verifying' && (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                <p>{t('common.loading')}</p>
              </>
            )}
            {status === 'success' && (
              <>
                <div className="text-green-500 text-4xl mb-4">✓</div>
                <h2 className="text-xl font-semibold mb-2">{t('auth.verifyEmailSuccess')}</h2>
                <button
                  onClick={() => navigate('/trips')}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  {t('nav.myTrips')}
                </button>
              </>
            )}
            {status === 'error' && (
              <>
                <div className="text-red-500 text-4xl mb-4">✗</div>
                <h2 className="text-xl font-semibold mb-2">{t('common.error')}</h2>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  {t('auth.login')}
                </button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
