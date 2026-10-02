package com.elearny.service;

import com.elearny.dto.request.SectionCreateRequest;
import com.elearny.dto.request.SubsectionCreateRequest;
import com.elearny.entity.*;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.SectionRepository;
import com.elearny.repository.SubsectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Section 7.2: FR8/FR9 - ordered Sections, each with ordered typed Sub-sections. */
@Service
@RequiredArgsConstructor
public class CourseContentService {

    private final SectionRepository sectionRepository;
    private final SubsectionRepository subsectionRepository;
    private final CourseService courseService;

    @Transactional
    public Section addSection(User requester, Long courseId, SectionCreateRequest req) {
        Course course = courseService.findEntity(courseId);
        courseService.assertOwnerOrAdmin(requester, course);
        Section section = Section.builder().title(req.title()).order(req.order()).course(course).build();
        return sectionRepository.save(section);
    }

    @Transactional
    public Subsection addSubsection(User requester, Long sectionId, SubsectionCreateRequest req) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));
        courseService.assertOwnerOrAdmin(requester, section.getCourse());
        Subsection subsection = Subsection.builder()
                .title(req.title()).contentType(req.contentType()).contentUrl(req.contentUrl())
                .order(req.order()).section(section).build();
        return subsectionRepository.save(subsection);
    }

    public Subsection findSubsection(Long id) {
        return subsectionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Sub-section not found"));
    }

    public Section findSection(Long id) {
        return sectionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Section not found"));
    }
}
