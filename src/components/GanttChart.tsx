import React, { useEffect } from "react";
import * as d3 from 'd3';
import { hexbin as d3Hexbin } from "d3-hexbin";
import "./GanttChart.css";

const GanttChart: React.FC = () => {
  useEffect(() => {
    // Variables to track selected skill and role.
    let selectedSkill: string | null = null;
    let selectedRole: string | null = null;

    // -----------------------
    // Data for Gantt Chart Roles (taskArray)
    // -----------------------
    interface Task {
      task: string;
      company: string;
      location: string;
      startTime: string;
      endTime: string;
      details: string;
      description: string[];
      duration?: string;
    }

    const taskArray: Task[] = [
      {
        task: "Front End Dev & Visualization Engineer",
        company: "Accenture Federal Services",
        location: "Washington, DC",
        startTime: "8/21/19",
        endTime: "3/1/25",
        details:
          "d3.js, angular, javascript, servicenow, jira, tableau, adobe, typescript, php, jquery, drupal, simplemaps, css, html, javascript",
        description: [
          "Lead development for site redesign effort using <strong>Drupal</strong> framework and <strong>jQuery</strong> to improve usability and better connect grant applicants with funding opportunities totaling over $12 billion.",
          "Maintained & configured custom map components using a combination of <strong>PHP</strong> & <strong>SimpleMaps</strong> for 200+ funding awardees.",
          "Built and deployed a fully functional MVP web application using <strong>Angular</strong> and <strong>ServiceNow</strong> to support COVID-19 pandemic relief efforts and connect applicants with subsidies for broadband.",
          "Improved site performance and UX through iterative UI enhancements, handling 23M+ enrollments and increasing accessibility as directed by the White House.",
          "Designed and developed dynamic dashboards to provide clear and compelling insights via <strong>D3.js</strong>, <strong>Angular</strong>, and <strong>Typescript</strong> through iterative wireframe workshops with stakeholders.",
          "Created engaging infographics and visuals using Adobe suite to improve data storytelling and communication for stakeholders.",
        ],
      },
      {
        task: "Data Viz",
        company: "Mather Economics",
        location: "Atlanta, GA",
        startTime: "11/2/18",
        endTime: "7/1/19",
        details: "tableau, mysql",
        description: [
          "Led wire-framing and exploratory data analysis for new dashboard design initiatives using <strong>Tableau</strong> and <strong>mySQL</strong>",
          "Led multiple re-design efforts to improve utility and user experience for existing dashboards",
          "Extract data using <strong>SQL/Hive</strong> to investigate outcomes of various visualization methods and confirm data structure requirements",
        ],
      },
      {
        task: "Sr. Analyst",
        company: "Mather Economics",
        location: "Atlanta, GA",
        startTime: "11/2/17",
        endTime: "11/1/18",
        details: "tableau, stata, vba, powershell, mysql",
        description: [
          "Launched product development efforts to migrate excel based reporting to <strong>Tableau</strong> & <strong>mySQL</strong>",
          "Improved accuracy of forecasting tool from 4% variance to 0.5% through methodology improvements in <strong>Stata</strong>",
          "Constructed and implemented statistical models in addition to A/B testing using <strong>Stata</strong>",
        ],
      },
      {
        task: "Analyst",
        company: "Mather Economics",
        location: "Atlanta, GA",
        startTime: "8/1/15",
        endTime: "11/1/17",
        details: "stata, vba, excel",
        description: [
          "Improved forecasting accuracy using <strong>Stata</strong>",
          "Implemented statistical models and A/B testing with <strong>Stata</strong>",
          "Developed forecasts using <strong>Excel</strong> and <strong>VBA</strong>",
        ],
      },
    ];

    taskArray.forEach((task) => {
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      const daysDuration = Math.round(
        (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
      );
      const yearsDuration = daysDuration / 365;
      const yearsClean = Math.floor(yearsDuration);
      let timeDuration = "";
      if (yearsDuration > 1) {
        const months = Math.round((daysDuration - yearsClean * 365) / 30);
        timeDuration = `${yearsClean} yrs ${months} mo`;
      } else {
        const months = Math.round(daysDuration / 30);
        timeDuration = `${months} mo`;
      }
      task.duration = timeDuration;
    });

    // -----------------------
    // Data for Skills Hexagons (skillsData)
    // -----------------------
    const skillsData = [
      { x: 0, y: 0, label: "" },
      { x: 20, y: 0, label: "" },
      { x: 40, y: 0, label: "" },
      { x: 60, y: 0, label: "" },
      { x: 80, y: 0, label: "" },
      { x: 100, y: 0, label: "" },
      { x: 10, y: 21, label: "jquery" },
      { x: 30, y: 21, label: "php" },
      { x: 50, y: 21, label: "javascript" },
      { x: 70, y: 21, label: "angular" },
      { x: 90, y: 21, label: "mysql" },
      { x: 90, y: 63, label: "css" },
      { x: 0, y: 42, label: "" },
      { x: 20, y: 42, label: "tableau" },
      { x: 40, y: 42, label: "adobe" },
      { x: 60, y: 42, label: "drupal" },
      { x: 80, y: 42, label: "d3.js" },
      { x: 100, y: 42, label: "simplemaps" },
      { x: 10, y: 63, label: "servicenow" },
      { x: 30, y: 63, label: "html" },
      { x: 50, y: 63, label: "jira" },
      { x: 70, y: 63, label: "typescript" },
    ];

    const skillsContainerWidth = 530;
    const skillsContainerHeight = 275;
    const skillsMargin = { top: 10, right: 30, bottom: 0, left: 40 };
    const skillsWidth =
      skillsContainerWidth - skillsMargin.left - skillsMargin.right;
    const skillsHeight =
      skillsContainerHeight - skillsMargin.top - skillsMargin.bottom;

    const xScale = d3.scaleLinear().domain([0, 128]).range([0, skillsWidth]);
    const yScale = d3.scaleLinear().domain([0, 90]).range([skillsHeight, 0]);
    const hexbinData: [number, number, string][] = skillsData.map((d) => [
      xScale(d.x),
      yScale(d.y),
      d.label,
    ]);

    const hexbin = d3Hexbin()
      .size([skillsWidth, skillsHeight])
      .radius(skillsWidth / 5 / 2.25);

    // -----------------------
    // Render Skills Hexagons
    // -----------------------
    const skillsSvg = d3.select("#skillsContainer").select("svg");
    skillsSvg.attr("viewBox", "0 0 460 250").html("");
    const skillsGroup = skillsSvg.append("g");

    const hexagons = skillsGroup
      .selectAll(".hexagon")
      .data(hexbinData)
      .enter()
      .append("path")
      .attr("class", "hexagon")
      .attr("d", hexbin.hexagon())
      .attr("transform", (d) => `translate(${d[0]},${d[1]})`)
      .attr("stroke", "#fff")
      .attr("stroke-width", "2px")
      .style("fill", "#6666ff")
      .style("opacity", 1)
      .on("click", function (event, d) {
        const clickedSkill = d[2];
        if (selectedSkill === clickedSkill) {
          selectedSkill = null;
          skillsGroup
            .selectAll(".hexagon")
            .transition()
            .duration(300)
            .style("opacity", 1)
            .style("stroke", "#fff")
            .style("stroke-width", "2px")
            .style("filter", "none");
          taskGroups.transition().duration(300).style("opacity", 1);
          const contentContainer = document.getElementById("contentContainer");
          if (contentContainer) {
            contentContainer.innerHTML = `<p class="alertMessage">Select a skill or role to display relevant details.</p>`;
          }
        } else {
          if (selectedRole !== null) {
            selectedRole = null;
            taskGroups.transition().duration(300).style("opacity", 1);
          }
          selectedSkill = clickedSkill;
          const titleContent = document.getElementById("dynamicTitle");
          if (titleContent) titleContent.textContent = "Skill Details";

          // Emphasize selected hexagon with a subtle purple glow; fade others.
          type HexagonData = [any, any, string];

          skillsGroup
            .selectAll<SVGGElement, HexagonData>(".hexagon")
            .transition()
            .duration(300)
            .style("opacity", (hd) =>
              hd[2].toLowerCase() === clickedSkill ? 1 : 0.5
            )
            .style("stroke", (hd) =>
              hd[2].toLowerCase() === clickedSkill ? "#6666ff" : "#fff"
            )
            .style("stroke-width", (hd) =>
              hd[2].toLowerCase() === clickedSkill ? "3px" : "2px"
            )
            .style("filter", (hd) =>
              hd[2].toLowerCase() === clickedSkill
                ? "drop-shadow(0 0 5px #6666ff)"
                : "none"
            );

          // Filter tasks in the Gantt chart that include the clicked skill.
          const filteredTasks = taskArray.filter((task) =>
            task.details.toLowerCase().includes(clickedSkill)
          );
          taskGroups.transition().duration(300).style("opacity", 0.3);
          taskGroups
            .filter((task) => task.details.toLowerCase().includes(clickedSkill))
            .transition()
            .duration(300)
            .style("opacity", 1);

          // Calculate cumulative experience.
          let totalMonths = 0;
          filteredTasks.forEach((task) => {
            let m = 0;
            const match = task.duration.match(/(\d+)\s*yrs?\s*(\d+)\s*mo/);
            if (match) {
              m = parseInt(match[1]) * 12 + parseInt(match[2]);
            } else {
              const matchMo = task.duration.match(/(\d+)\s*mo/);
              if (matchMo) m = parseInt(matchMo[1]);
            }
            totalMonths += m;
          });
          const cumYears = Math.floor(totalMonths / 12);
          const cumMonths = totalMonths % 12;

          // Build the Skill Details panel in contentContainer.
          var skillCapital =
            String(clickedSkill).charAt(0).toUpperCase() +
            String(clickedSkill).slice(1);
          let detailsHtml = `<p><strong id='notPurple'>Skill:</strong> ${skillCapital}</p>`;
          detailsHtml += `<p><strong id='notPurple'>Total Experience:</strong> ${cumYears} yrs ${cumMonths} mo</p>`;
          detailsHtml += `<ul>`;
          filteredTasks.forEach((task) => {
            detailsHtml += `<li><strong>${task.task}</strong> (${task.duration})`;
            const matchingDesc = task.description.filter((desc: string) =>
              desc.toLowerCase().includes(clickedSkill)
            );
            if (matchingDesc.length > 0) {
              detailsHtml += `<ul>`;
              matchingDesc.forEach((desc: string) => {
                detailsHtml += `<li>${desc}</li>`;
              });
              detailsHtml += `</ul>`;
            }
            detailsHtml += `</li>`;
          });
          detailsHtml += `</ul>`;
          const contentContainer = document.getElementById("contentContainer");
          if (contentContainer) contentContainer.innerHTML = detailsHtml;
        }
      });

    // Add text labels for hexagons with pointer-events disabled.
    skillsGroup
      .selectAll("text")
      .data(hexbinData)
      .enter()
      .append("text")
      .attr("x", (d) => d[0])
      .attr("y", (d) => d[1])
      .text((d) => d[2])
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "bottom")
      .style("font-size", "12px")
      .style("fill", "white")
      .style("font-weight", "bold")
      .style("pointer-events", "none");

    // -----------------------
    // Render Gantt Chart
    // -----------------------
    const ganttContainer = d3.select("#ganttChart");
    ganttContainer.select("svg").remove();
    const ganttSvg = ganttContainer
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", "0 0 1200 255")
      .attr("preserveAspectRatio", "xMinYMin");

    const dateFormat = d3.timeParse("%m/%d/%y");
    const minDate = d3.min(taskArray, (d) => dateFormat(d.startTime));
    const maxDate = d3.max(taskArray, (d) => dateFormat(d.endTime));

    if (!minDate || !maxDate) {
      throw new Error("Invalid date range");
    }

    const timeScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([0, 1200]);

    // Create task groups for each role.
    let taskGroups = ganttSvg
      .append("g")
      .selectAll("g")
      .data(taskArray)
      .enter()
      .append("g")
      .attr("x", 0)
      .attr("y", (d, i) => i * 44 + 30 - 2)
      .attr("width", 1200)
      .attr("height", 44)
      .attr("stroke", "none")
      .attr("fill", "none")
      .attr("class", "unselected");

    taskGroups
      .append("rect")
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("x", (d) => timeScale(dateFormat(d.startTime)!))
      .attr("y", (d, i) => i * 44 + 30)
      .attr(
        "width",
        (d) =>
          timeScale(dateFormat(d.endTime)!) -
          timeScale(dateFormat(d.startTime)!)
      )
      .attr("height", 40)
      .attr("stroke", "none")
      .attr("fill", "#6666ff")
      .classed("unselected", true);

    taskGroups
      .append("text")
      .text((d) => d.task)
      .attr(
        "x",
        (d) =>
          (timeScale(dateFormat(d.endTime)!) -
            timeScale(dateFormat(d.startTime)!)) /
            2 +
          timeScale(dateFormat(d.startTime)!)
      )
      .attr("y", (d, i) => i * 44 + 54)
      .attr("font-size", 11)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .classed("unselected", true);

    const tooltip = d3
      .select("#ganttChart")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Role click event: emphasize selected role and update related hexagon visuals.
    taskGroups.on("click", function (event, d) {
      if (selectedRole === d.task) {
        // Unselect role.
        selectedRole = null;
        taskGroups.transition().duration(300).style("opacity", 1);
        skillsGroup
          .selectAll(".hexagon")
          .transition()
          .duration(300)
          .style("opacity", 1)
          .style("stroke", "#fff")
          .style("stroke-width", "2px")
          .style("filter", "none");
        const contentContainer = document.getElementById("contentContainer");
        if (contentContainer) {
          contentContainer.innerHTML = `<p class="alertMessage">Select a skill or role to display relevant details.</p>`;
        }
        // Return early to prevent the rest of the handler from running.
        return;
      } else {
        if (selectedSkill !== null) {
          // Clear any selected skill.
          selectedSkill = null;
          skillsGroup
            .selectAll(".hexagon")
            .transition()
            .duration(300)
            .style("opacity", 1)
            .style("stroke", "#fff")
            .style("stroke-width", "2px")
            .style("filter", "none");
          const contentContainer = document.getElementById("contentContainer");
          if (contentContainer) contentContainer.innerHTML = "";
        }
        selectedRole = d.task;
      }

      const titleContent = document.getElementById("dynamicTitle");
      if (titleContent) titleContent.textContent = "Role Details";
      taskGroups.transition().duration(300).style("opacity", 0.3);
      d3.select(this).transition().duration(300).style("opacity", 1);
      const roleDetails = d.details.toLowerCase();
      skillsGroup
        .selectAll(".hexagon")
        .transition()
        .duration(300)
        .style("opacity", function (hd) {
          const skill = hd[2].toLowerCase();
          if (!skill) return 0.5; // If the label is empty, fade out.
          return roleDetails.includes(skill) ? 1 : 0.5;
        })
        .style("stroke", "#fff")
        .style("stroke-width", "2px");

      let detailsHtml = `<p><strong id='notPurple'>Role:</strong> ${d.task}</p>`;
      detailsHtml += `<p><strong id='notPurple'>Company:</strong> ${d.company}</p>`;
      detailsHtml += `<p><strong id='notPurple'>Duration:</strong> ${d.duration}</p>`;
      detailsHtml += `<ul>`;
      d.description.forEach((desc: string) => {
        detailsHtml += `<li>${desc}</li>`;
      });
      detailsHtml += `</ul>`;
      const contentContainer = document.getElementById("contentContainer");
      if (contentContainer) contentContainer.innerHTML = detailsHtml;
    });

    // Create X-Axis Grid.
    function makeGrid() {
      const xAxis = d3.axisBottom().scale(timeScale).tickFormat(d3.timeScale);

      ganttSvg
        .append("g")
        .attr("class", "grid")
        .attr("transform", "translate(1,220)")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("fill", "#000")
        .attr("stroke", "none")
        .attr("font-size", 12)
        .attr("dy", "1em");
    }

    makeGrid();

    // Set default alert message in detailsDiv on load.
    const contentContainer = document.getElementById("contentContainer");
    if (contentContainer && !selectedSkill && !selectedRole) {
      contentContainer.innerHTML = `<p class="alertMessage">Select a skill or role to display relevant details.</p>`;
    }
  }, []);

  return null;
};

export default GanttChart;
