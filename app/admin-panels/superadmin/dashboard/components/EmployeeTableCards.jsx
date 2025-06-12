'use client'

import React from 'react';
import PropTypes from 'prop-types';

const SimpleTable = ({ fields, data, title }) => {
  return (
    <div className="ls-widget">
      <div className="tabs-box">
        <div className="widget-title">
          <h5 className="text-base font-semibold mb-1">{title}</h5>
        </div>
        <div className="widget-content">
          <div className="table-outer">
            <table className="default-table manage-job-table w-full text-left border-collapse">
              <thead>
                <tr>
                  {fields.map((field, index) => (
                    <th key={index} className="p-2 font-medium text-gray-700 bg-gray-100 text-sm">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b hover:bg-gray-50">
                      {fields.map((field, colIndex) => (
                        <td key={colIndex} className="px-2 text-gray-600 text-sm truncate">
                          {row[field.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={fields.length} className="p-2 text-center text-gray-500 text-sm">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

SimpleTable.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
};

const EmployeeTableCards = () => {
  // Sample data for demonstration
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
  ];

  const fields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  const cardContent = [
    {
      id: 1,
      title: 'Team A',
      data: sampleData,
      uiClass: 'ui-blue',
    },
    {
      id: 2,
      title: 'Team B',
      data: sampleData,
      uiClass: 'ui-green',
    },
    {
      id: 3,
      title: 'Team C',
      data: sampleData,
      uiClass: 'ui-red',
    },
  ];

  return (
    <div className="flex flex-row gap-1 mb-8 col-xl-4 col-md-6 col-sm-12">
      {cardContent.map((item) => (
        <div
          key={item.id}
          className={`rounded-lg shadow-md  ${
            item.uiClass === 'ui-blue'
              ? 'bg-blue-100'
              : item.uiClass === 'ui-green'
              ? 'bg-green-100'
              : 'bg-red-100'
          }`}
        >
          <SimpleTable fields={fields} data={item.data} title={item.title} />
        </div>
      ))}
    </div>
  );
};

export default EmployeeTableCards;