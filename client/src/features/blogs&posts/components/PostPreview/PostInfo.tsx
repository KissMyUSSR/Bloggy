import { Link } from 'react-router-dom';

import formatDate from 'utility/formatDate';

type PostInfoProps = {
  _id?: string;
  authorName: string;
  color?: string;
  createdAt: string;
};

export function PostInfo({ _id, authorName, color, createdAt }: PostInfoProps) {
  return (
    <div className="mt-auto text-text-600 flex flex-col xs:block">
      <span className="hidden xs:inline">By </span>
      <Link
        to={'/blog/' + authorName}
        onClick={(e) => _id || e.preventDefault()}
        className={'cursor-pointer font-bold hover:underline text-accent-600'}
        style={{ color }}
      >
        {authorName}
      </Link>
      <span className="font-light text-sm md:text-base">
        <span className="hidden xs:inline mx-1"> | </span>
        {formatDate(createdAt)}
      </span>
    </div>
  );
}