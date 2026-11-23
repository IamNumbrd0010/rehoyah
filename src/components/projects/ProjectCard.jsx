/**
 * PROJECT PORTFOLIO CARD
 */

import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <article className="rehoyah-card rehoyah-card-interactive overflow-hidden flex flex-col">
      <Link to={`/projects/${project.slug}`} className="block aspect-[16/10] bg-[#F1F3F5] border-b border-[#EAECEF] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
            <span className="font-semibold text-[#B39022]">{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.projectType}</span>
          </p>
          <h3 className="mt-1.5 text-lg font-semibold text-[#0B2545] leading-snug">
            <Link to={`/projects/${project.slug}`} className="hover:underline">
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-[#4B5563] line-clamp-2">{project.description}</p>
        </div>
        <div className="pt-3 border-t border-[#F1F3F5] flex items-center justify-between text-xs text-[#6B7280]">
          <span className="truncate">{project.location}</span>
          <Link to={`/projects/${project.slug}`} className="font-semibold text-[#0B2545] hover:underline shrink-0 ml-2">
            View Case Study
          </Link>
        </div>
      </div>
    </article>
  );
}
