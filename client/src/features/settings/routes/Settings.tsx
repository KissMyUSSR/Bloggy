import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { blogInfo } from 'utility/mockData';
import { Icon } from 'components/Elements';
import { GeneralSettings, BlogSettings } from '../components';

export function Settings() {
  const [tabOpen, setTabOpen] = useState('general');
  const navigate = useNavigate();

  return (
    <main className="px-page py-8">
      <div className="relative border-b pb-1 border-secondary-300 flex items-end justify-center text-secondary-600 mb-6">
        <button onClick={() => navigate(-1)} className="absolute h-full left-0">
          <Icon type="long-arrow" className="h-4 text-secondary-600" />
        </button>
        <h2 className="text-2xl font-light">Settings</h2>
        <Link
          to={'/blog/' + blogInfo.username}
          className="font-medium hover:underline absolute right-0"
        >
          {blogInfo.username}
        </Link>
      </div>
      <div className="flex gap-12">
        <div className="flex flex-col gap-2 shrink-0 w-48">
          <button
            onClick={() => setTabOpen('general')}
            className={
              'rounded-md px-2 py-0.5 flex items-center text-lg ml-2 relative hover:bg-secondary-300 ' +
              (tabOpen === 'general'
                ? 'bg-secondary-200 before:h-6 before:inline-block before:absolute before:-left-2 before:w-1 before:rounded-md before:bg-accent-600'
                : '')
            }
          >
            General
          </button>
          <button
            onClick={() => setTabOpen('blog')}
            className={
              'rounded-md px-2 py-0.5 flex items-center text-lg ml-2 relative hover:bg-secondary-300 ' +
              (tabOpen === 'blog'
                ? 'bg-secondary-200 before:h-6 before:inline-block before:absolute before:-left-2 before:w-1 before:rounded-md before:bg-accent-600'
                : '')
            }
          >
            Blog
          </button>
        </div>
        {tabOpen === 'general' ? (
          <GeneralSettings {...blogInfo} />
        ) : (
          <div className="w-full">
            <h3 className="text-3xl font-medium font-display mb-5">Blog</h3>
            <BlogSettings {...blogInfo} labelClass="block mb-2" />
            <button className="mt-8 py-1 px-3 rounded-md border-2 bg-red-50 font-semibold text-red-600 border-red-300 hover:bg-red-300 hover:text-red-900">
              Delete blog
            </button>
          </div>
        )}
      </div>
    </main>
  );
}