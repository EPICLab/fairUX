// views/components/HtmlReportViewer.tsx
import React, { useState } from 'react';
import { Report, AnalysisResult, Bug, Violation, Rule } from '../../models/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HtmlReportViewerProps {
  report: Report;
  rules?: Rule[];
}

const HtmlReportViewer: React.FC<HtmlReportViewerProps> = ({ report, rules = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  
  const formatScreenshotName = (filename: string): string => {
    const name = filename.replace(/\.[^/.]+$/, ""); // Remove extension
    const words = name.match(/[A-Z]?[a-z]+|[A-Z]{2,}(?=[A-Z][a-z]|\d|\W|$)|\d+/g) || [];
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getRuleByRuleId = (ruleId: string): Rule | undefined => {
    return rules.find(rule => rule['Rule ID'] === ruleId);
  };

  const getSeverityStyles = (severity: string) => {
    const styles = {
      'High': {
        bgColor: '#FEE2E2',
        textColor: '#DC2626',
        borderColor: '#FECACA'
      },
      'Medium': {
        bgColor: '#FFEDD5',
        textColor: '#EA580C',
        borderColor: '#FED7AA'
      },
      'Low': {
        bgColor: '#ECFCCB',
        textColor: '#65A30D',
        borderColor: '#D9F99D'
      }
    };
    return styles[severity as keyof typeof styles] || {
      bgColor: '#F3F4F6', 
      textColor: '#4B5563',
      borderColor: '#E5E7EB'
    };
  };

  // Group bugs by rule ID
  const groupBugsByRuleId = (violations: Violation[]) => {
    const grouped: { [ruleId: string]: { violation: Violation; bugs: Bug[] } } = {};
    
    violations.forEach(violation => {
      if (!grouped[violation.rule_id]) {
        grouped[violation.rule_id] = {
          violation,
          bugs: []
        };
      }
      grouped[violation.rule_id].bugs.push(...violation.bugs);
    });
    
    return Object.values(grouped);
  };

  const handlePrevious = (): void => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : report.results.length - 1);
  };

  const handleNext = (): void => {
    setCurrentImageIndex(prev => prev < report.results.length - 1 ? prev + 1 : 0);
  };

  const handleImageClick = (): void => {
    setIsImageModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsImageModalOpen(false);
  };

  const currentResult: AnalysisResult = report.results[currentImageIndex];
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (!currentResult) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          <h2>No analysis results available</h2>
        </div>
      </div>
    );
  }

  const groupedBugs = currentResult.violations ? groupBugsByRuleId(currentResult.violations) : [];

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#F8FAFC',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '2px solid #E2E8F0',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#0F172A',
            margin: '0 0 0.25rem 0'
          }}>
            Inclusivity Bug Report
          </h1>
          <div style={{
            fontSize: '14px',
            color: '#64748B'
          }}>
            {currentDate} • Image {currentImageIndex + 1} of {report.results.length}
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Image Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#F1F5F9',
            borderRadius: '8px',
            padding: '0.5rem'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#6B7280',
              marginRight: '0.5rem'
            }}>
              Screenshots
            </span>
            <button
              onClick={handlePrevious}
              disabled={report.results.length <= 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                backgroundColor: 'white',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                cursor: report.results.length <= 1 ? 'not-allowed' : 'pointer',
                opacity: report.results.length <= 1 ? 0.5 : 1
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              minWidth: '60px',
              textAlign: 'center'
            }}>
              {currentImageIndex + 1} / {report.results.length}
            </span>
            <button
              onClick={handleNext}
              disabled={report.results.length <= 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                backgroundColor: 'white',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                cursor: report.results.length <= 1 ? 'not-allowed' : 'pointer',
                opacity: report.results.length <= 1 ? 0.5 : 1
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Left Side - Screenshot */}
        <div style={{
          flex: '0 0 50%',
          backgroundColor: 'white',
          borderRight: '2px solid #E2E8F0',
          borderRadius: '12px 0 0 12px',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            padding: '2rem 2rem 6rem 2rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
                {`Screenshot - ${formatScreenshotName(currentResult.screenshot)}`}
            </h2>
            
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '1rem',
              overflow: 'auto',
              position: 'relative'
            }}>
              {currentResult.screenshot_base64 ? (
                <div style={{ position: 'relative' }}>
                  <img 
                    src={currentResult.screenshot_base64}
                    alt="UI Screenshot"
                    onClick={handleImageClick}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Click to view
                  </div>
                </div>
              ) : (
                <div style={{ 
                  color: '#64748B', 
                  fontSize: '16px',
                  fontStyle: 'italic',
                  textAlign: 'center'
                }}>
                  {currentResult.screenshot_name || currentResult.screenshot}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Analysis Results */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '0 12px 12px 0',
          overflow: 'auto',
          boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            padding: '2rem 2rem 6rem 2rem',
            minHeight: '100%'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Analysis Results
            </h2>

            {groupedBugs.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                {groupedBugs.map((group, groupIndex) => {
                  const rule = getRuleByRuleId(group.violation.rule_id);
                  // Get the highest severity from all bugs in this group
                  const severities = group.bugs.map(bug => bug.severity);
                  const highestSeverity = severities.includes('High') ? 'High' : 
                                        severities.includes('Medium') ? 'Medium' : 'Low';
                  const severityStyles = getSeverityStyles(highestSeverity);
                  
                  return (
                    <div key={groupIndex} style={{
                      backgroundColor: 'white',
                      border: `2px solid ${severityStyles.borderColor}`,
                      borderRadius: '12px',
                      padding: '1.5rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {/* Rule Name Header */}
                      <div style={{
                        marginBottom: '1rem',
                        paddingBottom: '0.75rem',
                        borderBottom: '1px solid #E2E8F0'
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#0F172A',
                          margin: '0 0 0.5rem 0',
                          lineHeight: '1.3'
                        }}>
                          {rule ? rule['Rule Name'] : `Rule ${group.violation.rule_id}`}
                        </h3>
                        <div style={{ 
                          display: 'flex', 
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: '#E0F2FE',
                            color: '#0369A1',
                            border: '1px solid #BAE6FD'
                          }}>
                            {rule ? rule['Facet'] : group.violation.facet}
                          </span>
                        </div>
                      </div>

                      {/* All bugs for this rule */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        {group.bugs.map((bug, bugIndex) => (
                          <div key={bugIndex} style={{
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '1rem',
                            backgroundColor: '#FAFAFA'
                          }}>
                            {/* Location */}
                            <div style={{ marginBottom: '1rem' }}>
                              <h4 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#6B7280',
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Location
                              </h4>
                              <p style={{
                                fontSize: '14px',
                                color: '#374151',
                                lineHeight: '1.5',
                                margin: '0',
                                backgroundColor: '#F9FAFB',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #E5E7EB'
                              }}>
                                {bug.location}
                              </p>
                            </div>

                            {/* Issue */}
                            <div style={{ marginBottom: '1rem' }}>
                              <h4 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#DC2626',
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Inclusivity Bug
                              </h4>
                              <p style={{
                                fontSize: '14px',
                                color: '#374151',
                                lineHeight: '1.5',
                                margin: '0',
                                backgroundColor: '#FEF2F2',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #FECACA'
                              }}>
                                {bug.description}
                              </p>
                            </div>

                            {/* Recommendation */}
                            <div>
                              <h4 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#059669',
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Potential Fixes (Recommendation)
                              </h4>
                              <p style={{
                                fontSize: '14px',
                                color: '#374151',
                                lineHeight: '1.5',
                                margin: '0',
                                backgroundColor: '#F0FDF4',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #BBF7D0'
                              }}>
                                {bug.recommendation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '2px solid #BBF7D0',
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '48px',
                  color: '#059669',
                  marginBottom: '1rem'
                }}>
                  ✓
                </div>
                <h3 style={{
                  fontSize: '20px',
                  color: '#065F46',
                  margin: '0 0 0.5rem 0',
                  fontWeight: '600'
                }}>
                  Great Job!
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#047857',
                  margin: '0'
                }}>
                  No inclusivity issues found in this screenshot
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple Image Modal - No Zoom */}
      {isImageModalOpen && currentResult.screenshot_base64 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#374151',
              zIndex: 1001
            }}
          >
            ×
          </button>

          {/* Image Container */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 40px',
            overflow: 'auto'
          }}>
            <img 
              src={currentResult.screenshot_base64}
              alt="Full Screenshot"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>

          {/* Image Title */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {formatScreenshotName(currentResult.screenshot)}
          </div>
        </div>
      )}
    </div>
  );
};

export default HtmlReportViewer;