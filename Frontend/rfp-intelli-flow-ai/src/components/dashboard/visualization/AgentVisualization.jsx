import React, { useState, useEffect } from "react";
import {
  FileCheck,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  Gavel,
  BarChart,
  FileText,
  Sparkles,
  Brain,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import AgentConnectionLines from "./AgentConnectionLines";
import ThinkingDots from "./ThinkingDots";
import AgentProgressBadge from "./AgentProgressBadge";

const AgentVisualization = ({
  isAnalyzing = false,
  sessionData = null,
  onAnalysisComplete = () => {},
}) => {
  const [currentAgent, setCurrentAgent] = useState(0);
  const [currentAgentProgress, setCurrentAgentProgress] = useState(0);
  const [agentStatus, setAgentStatus] = useState([]);
  const [processComplete, setProcessComplete] = useState(false);

  // Define the agents in the workflow
  const agents = [
    {
      id: "eligibility_agent",
      name: "Eligibility Verification",
      description:
        "Analyzing compliance with all requirements and eligibility criteria",
      icon: <FileCheck className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
      particleColor: "59, 130, 246", // rgb values for blue-500
      activities: [
        "Verifying DUNS number",
        "Checking SAM registration status", 
        "Evaluating past performance requirements",
        "Confirming certifications and licenses",
        "Assessing technical capabilities",
      ],
    },
    {
      id: "checklist_agent",  
      name: "Submission Checklist",
      description: "Generating required documents and submission guidelines", 
      icon: <ClipboardList className="h-5 w-5" />,
      color: "text-green-500",
      bgColor: "bg-green-100",
      borderColor: "border-green-200", 
      particleColor: "34, 197, 94", // rgb values for green-500
      activities: [
        "Identifying required forms",
        "Listing required attachments",
        "Extracting submission deadlines", 
        "Compiling format requirements",
        "Organizing submission priorities",
      ],
    },
    {
      id: "risk_agent",
      name: "Risk Analysis", 
      description: "Analyzing contract and compliance risks",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-amber-500",
      bgColor: "bg-amber-100",  
      borderColor: "border-amber-200",
      particleColor: "245, 158, 11", // rgb values for amber-500
      activities: [
        "Identifying high-risk clauses",
        "Evaluating liability provisions", 
        "Assessing payment terms",
        "Analyzing intellectual property rights", 
        "Reviewing termination clauses",
      ],  
    },
    {
      id: "criteria_agent",
      name: "Competitive Analysis",
      description: "Evaluating competitive positioning and proposal strategy", 
      icon: <BarChart className="h-5 w-5" />,
      color: "text-purple-500",  
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
      particleColor: "168, 85, 247", // rgb values for purple-500  
      activities: [
        "Extracting evaluation criteria",
        "Identifying scoring weights",
        "Assessing competitive strengths",
        "Noting potential weaknesses", 
        "Developing win strategies",
      ],
    },
    {  
      id: "summary_agent",
      name: "Executive Summary",
      description: "Creating the final recommendation and next steps", 
      icon: <Gavel className="h-5 w-5" />,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
      borderColor: "border-indigo-200",
      particleColor: "99, 102, 241", // rgb values for indigo-500
      activities: [  
        "Composing opportunity overview",
        "Formulating go/no-go recommendation",
        "Highlighting key considerations", 
        "Outlining action plan",
        "Finalizing resource requirements",
      ],
    },
  ];

  // Simulate the progress of each agent  
  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentAgent(0);
      setCurrentAgentProgress(0);
      setAgentStatus([]);
      setProcessComplete(false);
      return;
    }
    
    // Initialize agent status
    setAgentStatus(
      agents.map((agent) => ({ id: agent.id, status: "pending", message: "" }))
    );

    // Function to update agent progress  
    const simulateAgentProgress = (agentIndex) => {
      if (agentIndex >= agents.length) {
        setProcessComplete(true);
        onAnalysisComplete(); 
        return;
      }
      
      setCurrentAgent(agentIndex);
      
      // Mark current agent as in progress
      setAgentStatus((prev) =>
        prev.map((agent, idx) =>
          idx === agentIndex
            ? {
                ...agent,
                status: "in_progress",
                message: "Starting analysis...",  
              }
            : agent
        )
      );
      
      // Progress counter
      let progress = 0;
      const agentActivities = agents[agentIndex].activities;
      const activityDuration = 100 / agentActivities.length;
      
      // Activity progress interval  
      const interval = setInterval(() => {
        const activityIndex = Math.floor(progress / activityDuration);
        
        if (activityIndex < agentActivities.length) {
          // Update current activity message
          setAgentStatus((prev) =>
            prev.map((agent, idx) =>
              idx === agentIndex
                ? { ...agent, message: agentActivities[activityIndex] }  
                : agent
            )
          );
        }
        
        progress += 5;
        setCurrentAgentProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Mark current agent as complete
          setAgentStatus((prev) =>
            prev.map((agent, idx) =>
              idx === agentIndex
                ? { ...agent, status: "complete", message: "Analysis complete" }
                : agent  
            )
          );
          
          // Move to next agent
          setTimeout(() => {
            simulateAgentProgress(agentIndex + 1);
          }, 500);
        }
      }, 400);
    };
    
    // Start the simulation
    simulateAgentProgress(0);

    // Cleanup 
    return () => {
      // Nothing to clean up for now
    };
  }, [isAnalyzing]);
  
  // Show visualization as soon as analysis starts
  if (!isAnalyzing && !sessionData) {
    return null;  
  }

  return (
    <div className="bg-white rounded-lg border shadow-md mt-4 mb-8">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <Brain className="h-5 w-5 mr-2 text-blue-500" />
          RFP Analysis Pipeline
        </h2>
        <p className="text-sm text-gray-500 flex items-center">
          {processComplete ? (
            "Analysis complete. Results are ready for review."  
          ) : (
            <>
              Our AI agents are analyzing your RFP document
              <ThinkingDots isActive={!processComplete} color="text-blue-500" />
            </>  
          )}
        </p>
      </div>

      <div className="p-4">
        {agents.map((agent, index) => {
          const status = agentStatus[index]?.status || "pending";
          const message = agentStatus[index]?.message || "";
          
          return (
            <div
              key={agent.id}
              className={`mb-4 p-4 rounded-lg border relative ${
                currentAgent === index && !processComplete
                  ? agent.borderColor
                  : status === "complete"
                  ? "border-green-200"  
                  : "border-gray-200"
              } ${
                currentAgent === index && !processComplete
                  ? agent.bgColor
                  : status === "complete"
                  ? "bg-green-50"
                  : "bg-gray-50"  
              }`}
            >
              {/* Add connection lines between agents */}
              {index < agents.length - 1 && status === "in_progress" && (
                <AgentConnectionLines
                  active={true}
                  color={agent.particleColor}
                />
              )}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      status === "complete"
                        ? "bg-green-100"
                        : status === "in_progress"  
                        ? agent.bgColor
                        : "bg-gray-100"
                    }`}
                  >
                    {status === "complete" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      agent.icon  
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-xs text-gray-500">{agent.description}</p>  
                  </div>
                </div>
                
                <AgentProgressBadge status={status} />
              </div>

              {(status === "in_progress" || status === "complete") && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">  
                    <div className="flex items-center">
                      {status === "in_progress" && (
                        <span className="inline-block mr-2">
                          <Sparkles
                            className={`h-3 w-3 ${agent.color} animate-pulse`}  
                          />
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {status === "in_progress"
                          ? message
                          : "Analysis complete"}
                      </span>
                    </div>
                    <span className="text-xs font-medium">
                      {status === "complete"
                        ? "100%"  
                        : `${Math.round(currentAgentProgress)}%`}
                    </span>
                  </div>
                  <Progress
                    value={status === "complete" ? 100 : currentAgentProgress}
                    className={`h-1.5 ${
                      status === "in_progress" ? "animate-pulse" : ""  
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {processComplete && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />  
              <span className="font-medium">Analysis Complete</span>
            </div>
            <button
              onClick={() => onAnalysisComplete(sessionData)}
              className="btn btn-primary btn-sm"
            >
              Review Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentVisualization;