import React, { useState } from 'react';
import {
  BookOpen,
  Eye,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ACADEMY_ARTICLES, BODY_LANGUAGE_GUIDE, REFERENCES_LIST, AcademyArticle } from '../data/academyArticles';
import { useLanguage } from '../context/LanguageContext';

export const AcademyView: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'articles' | 'body_language' | 'references'>('articles');
  const [selectedArticle, setSelectedArticle] = useState<AcademyArticle | null>(null);

  const getStatusBadge = (status: 'friendly' | 'curious' | 'warning' | 'relaxed') => {
    switch (status) {
      case 'friendly':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'curious':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'warning':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'relaxed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {t.academyTitle}
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          {t.academySubtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-orange-100/50 p-1 rounded-2xl border border-orange-200/50 text-xs">
        <button
          onClick={() => {
            setActiveTab('articles');
            setSelectedArticle(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'articles'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t.academyTabArticles}</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('body_language');
            setSelectedArticle(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'body_language'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.academyTabBodyLanguage}</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('references');
            setSelectedArticle(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'references'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>{t.academyTabReferences}</span>
        </button>
      </div>

      {/* ARTICLE READER */}
      {selectedArticle ? (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-orange-100 space-y-6 animate-fadeIn">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 mb-2"
          >
            <span>← {t.backToArticles}</span>
          </button>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${selectedArticle.badgeColor}`}
              >
                {language === 'id' ? selectedArticle.category.id : selectedArticle.category.en}
              </span>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {selectedArticle.readMinutes} {language === 'id' ? 'menit baca' : 'min read'}
                </span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              {language === 'id' ? selectedArticle.title.id : selectedArticle.title.en}
            </h3>

            <p className="text-xs text-gray-600 mt-2 italic leading-relaxed bg-orange-50/50 p-3.5 rounded-2xl border border-orange-100/60">
              {language === 'id' ? selectedArticle.summary.id : selectedArticle.summary.en}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-5 text-xs text-gray-700 leading-relaxed font-normal">
            {selectedArticle.sections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <h4 className="text-sm font-bold text-gray-900">
                  {language === 'id' ? sec.heading.id : sec.heading.en}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'id' ? sec.content.id : sec.content.en}
                </p>
              </div>
            ))}
          </div>

          {/* Practical Tips Box */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2">
            <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t.practicalTipsHeader}</span>
            </h5>
            <ul className="space-y-1.5 text-xs text-emerald-950 font-normal">
              {selectedArticle.practicalTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{language === 'id' ? tip.id : tip.en}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial notice */}
          {selectedArticle.editorialNotice && (
            <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-3 italic">
              {language === 'id' ? selectedArticle.editorialNotice.id : selectedArticle.editorialNotice.en}
            </div>
          )}
        </div>
      ) : activeTab === 'articles' ? (
        /* ARTICLES LIST */
        <div className="space-y-3">
          {ACADEMY_ARTICLES.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white p-4 sm:p-5 rounded-3xl border border-orange-100 shadow-sm hover:border-orange-300 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${article.badgeColor}`}
                  >
                    {language === 'id' ? article.category.id : article.category.en}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {article.readMinutes} {language === 'id' ? 'menit' : 'min'}
                    </span>
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-gray-900 group-hover:text-orange-600 transition truncate">
                  {language === 'id' ? article.title.id : article.title.en}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-normal">
                  {language === 'id' ? article.summary.id : article.summary.en}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition self-end sm:self-center flex-shrink-0">
                <span>{language === 'id' ? 'Baca' : 'Read'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'body_language' ? (
        /* BODY LANGUAGE GUIDE */
        <div className="space-y-3">
          <div className="p-3.5 bg-orange-50/60 border border-orange-200/80 rounded-2xl text-xs text-orange-900 leading-relaxed font-normal">
            {language === 'id'
              ? 'Kucing berkomunikasi 80% melalui bahasa tubuh. Perhatikan kombinasi posisi telinga, ekor, mata, dan kumis untuk memahami pesan mereka.'
              : 'Cats communicate over 80% through posture and micro-signals. Observe ears, tail, eyes, and whiskers simultaneously.'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BODY_LANGUAGE_GUIDE.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-2 hover:border-orange-200 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-black text-gray-900">
                    {language === 'id' ? item.part.id : item.part.en}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-gray-700 font-semibold">
                    🔍 {language === 'id' ? item.signal.id : item.signal.en}
                  </p>
                  <p className="text-gray-500 leading-relaxed">
                    💡 <strong className="text-gray-700">{language === 'id' ? 'Artinya:' : 'Meaning:'}</strong>{' '}
                    {language === 'id' ? item.meaning.id : item.meaning.en}
                  </p>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-600 border border-gray-100">
                  <span className="font-bold text-gray-800">{language === 'id' ? 'Saran: ' : 'Advice: '}</span>
                  {language === 'id' ? item.advice.id : item.advice.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* REFERENCES & ETHICS */
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-5 text-xs text-gray-700 leading-relaxed">
          <div className="space-y-2">
            <h4 className="text-base font-extrabold text-gray-900">
              {language === 'id' ? 'Prinsip Kesejahteraan & Sumber Edukasi' : 'Welfare Ethics & Educational Sources'}
            </h4>
            <p className="text-gray-600">
              {t.editorialDisclaimer}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-orange-700">
              {language === 'id' ? 'Daftar Referensi Ilmiah & Etologi' : 'Scientific & Ethological References'}
            </h5>
            <div className="space-y-2.5">
              {REFERENCES_LIST.map((ref, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-0.5">
                  <p className="font-bold text-gray-900">{ref.title}</p>
                  <p className="text-[11px] text-gray-500">{ref.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
