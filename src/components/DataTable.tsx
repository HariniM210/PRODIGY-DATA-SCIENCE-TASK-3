import React, { useState } from 'react';
import { Customer } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps {
  data: Customer[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = data.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left rounded-tl-md">ID</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Job</th>
              <th className="px-4 py-2 text-left">Education</th>
              <th className="px-4 py-2 text-left">Balance</th>
              <th className="px-4 py-2 text-left">Housing</th>
              <th className="px-4 py-2 text-left">Loan</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left rounded-tr-md">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((customer, index) => (
              <tr 
                key={customer.id} 
                className={`border-t border-gray-800 ${index % 2 === 0 ? 'bg-gray-850' : 'bg-gray-900'}`}
              >
                <td className="px-4 py-2 text-gray-400">{customer.id}</td>
                <td className="px-4 py-2 text-gray-200">{customer.age}</td>
                <td className="px-4 py-2 text-gray-200">{customer.job}</td>
                <td className="px-4 py-2 text-gray-200">{customer.education}</td>
                <td className="px-4 py-2 text-gray-200">{customer.balance}</td>
                <td className="px-4 py-2 text-gray-200">{customer.housing}</td>
                <td className="px-4 py-2 text-gray-200">{customer.loan}</td>
                <td className="px-4 py-2 text-gray-200">{customer.duration}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                    customer.subscribed 
                      ? 'bg-green-900 text-green-300 border border-green-600' 
                      : 'bg-red-900 text-red-300 border border-red-600'
                  }`}>
                    {customer.subscribed ? 'Y' : 'N'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, data.length)} of {data.length} records
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${
                currentPage === 1 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-1 rounded-md ${
                currentPage === totalPages 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;