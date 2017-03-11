require "tempfile"
require "fileutils"

module Fastlane
  module Actions
    class SetGradleVersionNameAction < Action
      def self.run(params)
        gradle_file = params[:gradle_file]

        old_version_name = '0'
        new_version_name = params[:version_name]

        temp_file = Tempfile.new('fastlaneSetVersionName')

        File.foreach(gradle_file) do |line|
          if line.include? 'versionName '
            old_version_name = line.strip.split(' ')[1]
            line = line.sub(old_version_name, "\"#{new_version_name}\"")
          end
          temp_file.puts line
        end

        temp_file.rewind
        temp_file.close
        FileUtils.mv(temp_file.path, gradle_file)
        temp_file.unlink

        if old_version_name == '0' || new_version_name == '1'
          UI.user_error!("Impossible to find the version name in the current project folder #{gradle_file}")
        else
          UI.success("Version name has been changed from #{old_version_name} to #{new_version_name}")
        end

        new_version_name
      end

      def self.description
        'Change the version name of your android project.'
      end

      def self.authors
        ['Jérémy TOUDIC', 'Hawken Rives']
      end

      def self.available_options
        [
          FastlaneCore::ConfigItem.new(key: :gradle_file,
                                       description: 'The path to the build.gradle file',
                                       type: String),
          FastlaneCore::ConfigItem.new(key: :version_name,
                                       description: 'The version to change to',
                                       type: String),
        ]
      end

      def self.is_supported?(platform)
        [:android].include?(platform)
      end
    end
  end
end
