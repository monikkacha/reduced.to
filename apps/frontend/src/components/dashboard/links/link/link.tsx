import { component$, $ } from '@builder.io/qwik';
import { getLinkFromKey } from '../../../temporary-links/utils';
import LinkActionsDropdown from './link-actions-dropdown';
import { HiArrowTopRightOnSquareOutline, HiClipboardDocumentOutline, HiQrCodeOutline, HiTrashOutline } from '@qwikest/icons/heroicons';
import { formatDateDay } from '../../../../lib/date-utils';
import { useToaster } from '../../../toaster/toaster';
import { copyToClipboard } from '../../../../utils';
import { LuLineChart } from '@qwikest/icons/lucide';
import { Link } from '@builder.io/qwik-city';

export interface LinkBlockProps {
  id: string;
  urlKey: string;
  url: string;
  clicks: number;
  favicon?: string;
  createdAt: string;
  expirationTime?: string;
  onShowQR: () => void;
  onDelete: (id: string) => void;
}

export const LinkBlock = component$(
  ({ id, urlKey, url, favicon, createdAt, expirationTime, clicks, onShowQR, onDelete }: LinkBlockProps) => {
    const link = getLinkFromKey(urlKey);
    const toaster = useToaster();

    return (
      <>
        <div class="shadow-lg rounded-xl p-3 mb-3 bg-white dark:bg-dark-modal">
          <div class="grid grid-cols-12 gap-4">
            {/* First column with the link and favicon */}
            <div class="flex items-center space-x-3 col-span-6">
              <div class="hidden sm:block flex-shrink-0">
                <img
                  alt={new URL(url).hostname}
                  src={favicon || `https://www.google.com/s2/favicons?sz=128&domain_url=${url}`}
                  class="w-8 h-8 rounded-full"
                />
              </div>
              <div class="flex flex-col text-left w-full">
                <a href={link} target="_blank" rel="noopener noreferrer" class="text-sm font-medium truncate">
                  {link}
                </a>
                <a href={url} target="_blank" rel="noopener noreferrer" class="text-xs mt-1 font-medium text-gray-500 truncate">
                  {url}
                </a>
              </div>
            </div>

            {/* Second column with the created date */}
            <div class="gap-4 mt-2 items-center justify-end hidden sm:flex col-span-4 sm:mr-4">
              {expirationTime && (
                <div class="flex flex-col justify-start mr-3">
                  <span class="text-xs font-medium  ">{formatDateDay(new Date(expirationTime))}</span>
                  <span class="text-xs font-medium text-gray-500 mb-1 mt-1">Expire At</span>
                </div>
              )}
              <div class="flex flex-col justify-start mr-3">
                <span class="text-xs font-medium  ">{formatDateDay(new Date(createdAt))}</span>
                <span class="text-xs font-medium text-gray-500 mb-1 mt-1">Created At</span>
              </div>
            </div>

            {/* Third column with the actions dropdown */}
            <div class="flex items-center justify-end col-span-6 sm:col-span-2">
              <div class="flex items center justify-end">
                <Link href={`/dashboard/analytics/${urlKey}`} class="btn btn-xs btn-ghost border border-gray-200 dark:border-gray-600">
                  <LuLineChart class="w-4 h-4" />
                  {clicks}
                  <span class="hidden md:block">clicks</span>
                </Link>
              </div>
              <LinkActionsDropdown
                url={url}
                actions={[
                  {
                    name: 'Open',
                    icon: <HiArrowTopRightOnSquareOutline />,
                    href: url,
                    target: '_blank',
                  },
                  {
                    name: 'Copy',
                    icon: <HiClipboardDocumentOutline />,
                    action: $(() => {
                      copyToClipboard(getLinkFromKey(urlKey));
                      toaster.add({ title: 'Success', description: 'The url has been copied to the clipboard!' });
                    }),
                  },
                  {
                    name: 'QR',
                    icon: <HiQrCodeOutline />,
                    action: $(() => {
                      onShowQR();
                    }),
                  },
                  {
                    name: 'Delete',
                    class: 'text-red-500',
                    action: $(() => {
                      onDelete(id);
                    }),
                    icon: <HiTrashOutline />,
                  },
                ]}
              />
            </div>
          </div>
          <div class="gap-4 mt-2 flex items-center justify-between sm:hidden">
            <div class="flex justify-start items-center gap-1 ml-3">
              <span class="text-xs font-medium text-gray-500 mb-1 mt-1">Created At</span>
              <span class="text-xs font-medium  ">{formatDateDay(new Date(createdAt))}</span>
            </div>
            {expirationTime && (
              <div class="flex justify-start items-center gap-1 mr-3">
                <span class="text-xs font-medium text-gray-500 mb-1 mt-1">Expire At</span>
                <span class="text-xs font-medium  ">{formatDateDay(new Date(expirationTime))}</span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);
